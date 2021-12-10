import _ from 'underscore';
import lodashGet from 'lodash/get';
import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import ONYXKEYS from '../ONYXKEYS';
import styles from '../styles/styles';
import KeyboardSpacer from '../components/KeyboardSpacer';
import Navigation from '../libs/Navigation/Navigation';
import withWindowDimensions, {windowDimensionsPropTypes} from '../components/withWindowDimensions';
import HeaderWithCloseButton from '../components/HeaderWithCloseButton';
import ScreenWrapper from '../components/ScreenWrapper';
import FullScreenLoadingIndicator from '../components/FullscreenLoadingIndicator';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import compose from '../libs/compose';

import AddressSearch from '../components/AddressSearch';

const propTypes = {
    /* Onyx Props */
    address: PropTypes.shape({
        addressStreet: PropTypes.string,
        addressCity: PropTypes.string,
        addressState: PropTypes.string,
        addressZipCode: PropTypes.string,
    }),

    /** Window Dimensions Props */
    ...windowDimensionsPropTypes,

    /** Localize Props */
    ...withLocalizePropTypes,
};

const defaultProps = {
    address: {
        addressStreet: '',
        addressCity: '',
        addressState: '',
        addressZipCode: '',
    },
};

const AddressSearchPage = (props) => {
    const addressStreet = lodashGet(props.address, 'addressStreet', '');
    const addressCity = lodashGet(props.address, 'addressCity', '');
    const addressState = lodashGet(props.address, 'addressState', '');
    const addressZipCode = lodashGet(props.address, 'addressZipCode', '');
    const fullAddress = _.compact([addressStreet, addressCity, addressState, addressZipCode]).join(', ');

    return (
        <ScreenWrapper>
            {({didScreenTransitionEnd}) => (
                <>
                    <HeaderWithCloseButton
                        title={props.translate('common.search')}
                        onCloseButtonPress={() => Navigation.dismissModal(true)}
                    />
                    <View style={[styles.flex1, styles.w100, styles.pRelative]}>
                        <FullScreenLoadingIndicator visible={!didScreenTransitionEnd} />
                        {didScreenTransitionEnd && (
                            <AddressSearch
                                label={props.translate('addDebitCardPage.billingAddress')}
                                containerStyles={[styles.mh5]}
                                value={fullAddress}
                            />
                        )}
                    </View>
                    <KeyboardSpacer />
                </>
            )}
        </ScreenWrapper>
    );
};

AddressSearchPage.propTypes = propTypes;
AddressSearchPage.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        address: {
            key: ONYXKEYS.SELECTED_ADDRESS,
        },
    }),
)(AddressSearchPage);