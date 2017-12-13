class NetworkConfig {
    /**
     * @constructor
     * @param {string} host
     * @param {number} port
     * @param {string} key
     * @param {string} cert
     * @param {Services} [services]
     */
    constructor(host, port, key, cert, services) {
        /** @type {Services} */
        this._services = services || new Services(Services.FULL, Services.FULL);

        /** @type {string} */
        this._key = key;
        /** @type {string} */
        this._cert = cert;

        /** @type {PeerAddress} */
        this._peerAddress = new WsPeerAddress(
            this._services.provided, Time.now(), NetAddress.UNSPECIFIED, host, port);
    }

    /**
     * @returns {PeerAddress}
     */
    get peerAddress() {
        // if (!this._host || !this._port) {
        if (!this._peerAddress) {
            throw 'PeerAddress is not configured.';
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
     * @returns {{key: string, cert: string}}
     */
    get sslConfig() {
        return {
            key: this._key,
            cert: this._cert
        };
    }

    /**
     * Used for filtering peer addresses by protocols.
     * @returns {number}
     */
    static myProtocolMask() {
        return Protocol.WS;
    }

    /**
     * @param {number} protocol
     * @returns {boolean}
     */
    static canConnect(protocol) {
        return protocol === Protocol.WS;
    }
}
Class.register(NetworkConfig);
