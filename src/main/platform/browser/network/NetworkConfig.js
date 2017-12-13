class NetworkConfig {
    /**
     * @constructor
     * @param {Services} [services]
     * @param {SignalId} [signalId]
     */
    constructor(services, signalId) {
        /** @type {Services} */
        this._services = services || new Services(Services.FULL, Services.FULL);

        if (!PlatformUtils.supportsWebRTC()) {
            this._peerAddress = DumbPeerAddress(
                this._services.provided, Time.now(), NetAddress.UNSPECIFIED,
                /*id*/ NumberUtils.randomUint64());
        } else if (signalId) {
            this._peerAddress = new RtcPeerAddress(
                this._services.provided, Time.now(), NetAddress.UNSPECIFIED,
                signalId, /*distance*/ 0);
        }
    }

    /**
     * @returns {PeerAddress}
     */
    get peerAddress() {
        if (!this._peerAddress) {
            throw 'PeerAddress is not configured';
        }
        return this._peerAddress;
    }

    /**
     * @returns {Services}
     */
    get services() {
        return this._services;
    }

    /**
     * @param {SignalId} signalId
     * @returns {void}
     */
    configurePeerAddress(signalId) {
        this._peerAddress = new RtcPeerAddress(
            this._services.provided, Time.now(), NetAddress.UNSPECIFIED,
            signalId, /*distance*/ 0);
    }

    /**
     * Used for filtering peer addresses by protocols.
     *  @returns {number}
     */
    static myProtocolMask() {
        return Protocol.WS | Protocol.RTC;
    }

    /**
     * @param {number} protocol
     * @returns {boolean}
     */
    static canConnect(protocol) {
        switch (protocol) {
            case Protocol.WS:
                return true;
            case Protocol.RTC:
                return PlatformUtils.supportsWebRTC();
            case Protocol.DUMB:
            default:
                return false;
        }
    }
}
Class.register(NetworkConfig);
