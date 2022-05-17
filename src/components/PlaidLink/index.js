import React from 'react';
import {View} from 'react-native';
import styles from '../../styles/styles';
import {plaidLinkPropTypes, plaidLinkDefaultProps} from './plaidLinkPropTypes';

class PlaidLink extends React.Component {
    constructor(props) {
        super(props);
        this.onMessage = this.onMessage.bind(this);
        this.state = {
            isHidden: false,
        };
    }

    componentDidMount() {
        window.addEventListener('plaidEvent', this.onMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('plaidEvent', this.onMessage);
    }

    /**
    * @param {String} e This is the type of event emitted by plaid
    */
    onMessage(e) {
        if (e.detail === undefined) {
            return;
        }
        switch (e.detail.eventName) {
            case 'plaid-on-event':
                if (e.detail.event === 'ERROR') {
                    this.props.onError(e.detail.metadata);
                }
                if (e.detail.event === 'HANDOFF') {
                    this.setState({isHidden: true});
                }
                break;
            case 'plaid-on-success':
                // eslint-disable-next-line no-case-declarations
                const linkSuccess = {publicToken: e.detail.public_token, metadata: e.detail.metadata};
                this.props.onSuccess(linkSuccess);
                break;
            case 'plaid-on-exit':
                this.props.onExit();
                break;
            default:
                break;
        }
    }

    render() {
        if (this.state.isHidden) {
            return null;
        }

        return (
            <View
                style={styles.plaidLink}
            >
                <iframe
                    ref={el => this.iframe = el}
                    src={`/plaid.html?token=${this.props.token}`}
                    height="100%"
                    width="100%"
                    seamless="seamless"
                    scrolling="no"
                    title="Connect with Plaid"
                    frameBorder="0"
                />

            </View>
        );
    }
}

PlaidLink.propTypes = plaidLinkPropTypes;
PlaidLink.defaultProps = plaidLinkDefaultProps;
PlaidLink.displayName = 'PlaidLink';
export default PlaidLink;
