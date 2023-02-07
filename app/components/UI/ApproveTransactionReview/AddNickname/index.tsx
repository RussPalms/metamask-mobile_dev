import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EthereumAddress from '../../EthereumAddress';
import Engine from '../../../../core/Engine';
import { MetaMetricsEvents } from '../../../../core/Analytics';
import AnalyticsV2 from '../../../../util/analyticsV2';

import { toChecksumAddress } from 'ethereumjs-util';
import { connect } from 'react-redux';
import StyledButton from '../../StyledButton';
import Text from '../../../../component-library/components/Texts/Text';
import InfoModal from '../../Swaps/components/InfoModal';
import Identicon from '../../../UI/Identicon';
import Feather from 'react-native-vector-icons/Feather';
import { strings } from '../../../../../locales/i18n';
import GlobalAlert from '../../../UI/GlobalAlert';
import { showAlert } from '../../../../actions/alert';
import ClipboardManager from '../../../../core/ClipboardManager';
import Header from '../AddNickNameHeader';
import ShowBlockExplorer from '../ShowBlockExplorer';
import { useTheme } from '../../../../util/theme';
import createStyles from './styles';
import { AddNicknameProps } from './types';
import { validateAddressOrENS } from '../../../../util/address';
import ErrorMessage from '../../../Views/SendFlow/ErrorMessage';
import {
  CONTACT_ALREADY_SAVED,
  SYMBOL_ERROR,
} from '../../../../constants/error';

const getAnalyticsParams = () => ({});

const AddNickname = (props: AddNicknameProps) => {
  const {
    closeModal,
    address,
    showModalAlert,
    addressNickname,
    networkState: {
      network,
      provider: { type, chainId },
    },
    addressBook,
    identities,
  } = props;

  const [newNickname, setNewNickname] = useState(addressNickname);
  const [addressErr, setAddressErr] = useState(null);
  const [addressHasError, setAddressHasError] = useState(false);
  const [errContinue, setErrContinue] = useState(false);
  const [isBlockExplorerVisible, setIsBlockExplorerVisible] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);

  const chooseToContinue = () => {
    setAddressHasError(true);
    return setAddressHasError(!addressHasError);
  };

  const validateAddressOrENSFromInput = useCallback(async () => {
    const { addressError, errorContinue } = await validateAddressOrENS({
      toAccount: address,
      network,
      addressBook,
      identities,
      chainId,
    });

    setAddressErr(addressError);
    setErrContinue(errorContinue);
    setAddressHasError(addressError);
  }, [address, network, addressBook, identities, chainId]);

  useEffect(() => {
    validateAddressOrENSFromInput();
  }, [validateAddressOrENSFromInput]);

  const copyAddress = async () => {
    await ClipboardManager.setString(address);
    showModalAlert({
      isVisible: true,
      autodismiss: 1500,
      content: 'clipboard-alert',
      data: { msg: strings('transactions.address_copied_to_clipboard') },
    });

    AnalyticsV2.trackEvent(
      MetaMetricsEvents.CONTRACT_ADDRESS_COPIED,
      getAnalyticsParams(),
    );
  };

  const saveTokenNickname = () => {
    const { AddressBookController } = Engine.context;
    if (!newNickname || !address) return;
    AddressBookController.set(toChecksumAddress(address), newNickname, network);
    closeModal();
    AnalyticsV2.trackEvent(
      MetaMetricsEvents.CONTRACT_ADDRESS_NICKNAME,
      getAnalyticsParams(),
    );
  };

  const showFullAddressModal = () => {
    setShowFullAddress(!showFullAddress);
  };

  const toggleBlockExplorer = () => setIsBlockExplorerVisible(true);

  const renderErrorMessage = (addressError: any) => {
    let errorMessage = addressError;

    if (addressError === CONTACT_ALREADY_SAVED) {
      errorMessage = strings('address_book.address_already_saved');
    }
    if (addressError === SYMBOL_ERROR) {
      errorMessage = `${
        strings('transaction.tokenContractAddressWarning_1') +
        strings('transaction.tokenContractAddressWarning_2') +
        strings('transaction.tokenContractAddressWarning_3')
      }`;
    }

    return errorMessage;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isBlockExplorerVisible ? (
        <ShowBlockExplorer
          setIsBlockExplorerVisible={setIsBlockExplorerVisible}
          type={type}
          address={address}
          headerWrapperStyle={styles.headerWrapper}
          headerTextStyle={styles.headerText}
          iconStyle={styles.icon}
          networkProvider={{
            rpcTarget: '',
          }}
          frequentRpcList={[]}
        />
      ) : (
        <>
          <Header
            closeModal={closeModal}
            nicknameExists={!!addressNickname}
            headerWrapperStyle={styles.headerWrapper}
            headerTextStyle={styles.headerText}
            iconStyle={styles.icon}
          />
          <View style={styles.bodyWrapper} testID={'contract-nickname-view'}>
            {showFullAddress && (
              <InfoModal
                isVisible
                message={address}
                propagateSwipe={false}
                toggleModal={showFullAddressModal}
              />
            )}
            <View style={styles.addressIdenticon}>
              <Identicon address={address} diameter={25} />
            </View>
            <Text style={styles.label}>{strings('nickname.address')}</Text>
            <View style={styles.addressWrapperPrimary}>
              <TouchableOpacity
                style={styles.addressWrapper}
                onPress={copyAddress}
                onLongPress={showFullAddressModal}
              >
                <Feather name="copy" size={18} style={styles.actionIcon} />
                <EthereumAddress
                  address={address}
                  type="mid"
                  style={styles.address}
                />
              </TouchableOpacity>
              <AntDesignIcon
                style={styles.actionIcon}
                name="export"
                size={22}
                onPress={toggleBlockExplorer}
              />
            </View>
            <Text style={styles.label}>{strings('nickname.name')}</Text>
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={setNewNickname}
              placeholder={strings('nickname.name_placeholder')}
              placeholderTextColor={colors.text.muted}
              spellCheck={false}
              numberOfLines={1}
              style={styles.input}
              value={newNickname}
              editable={!addressHasError}
              testID={'contract-name-input'}
              keyboardAppearance={themeAppearance}
            />
            {addressHasError && (
              <View style={styles.errorContinue}>
                <ErrorMessage
                  errorMessage={renderErrorMessage(addressErr)}
                  errorContinue={!!errContinue}
                  onContinue={chooseToContinue}
                />
              </View>
            )}
          </View>
          <View style={styles.updateButton}>
            <StyledButton
              type={'confirm'}
              disabled={!newNickname || addressHasError}
              onPress={saveTokenNickname}
              testID={'nickname.save_nickname'}
            >
              {strings('nickname.save_nickname')}
            </StyledButton>
          </View>
          <GlobalAlert />
        </>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state: any) => ({
  networkState: state.engine.backgroundState.NetworkController,
  addressBook: state.engine.backgroundState.AddressBookController.addressBook,
  identities: state.engine.backgroundState.PreferencesController.identities,
});

const mapDispatchToProps = (dispatch: any) => ({
  showModalAlert: (config: {
    isVisible: boolean;
    autodismiss: number;
    content: string;
    data: { msg: string };
  }) => dispatch(showAlert(config)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNickname);
