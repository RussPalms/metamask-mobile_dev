import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import ActionModal from '../../UI/ActionModal';

const styles = {
	whatIsSeedphraseTitle: {
		fontSize: 18,
		color: colors.fontPrimary,
		textAlign: 'center',
		...fontStyles.bold
	},
	modalNoBorder: {
		borderTopWidth: 0
	},
	modalContainer: {
		flex: 1,
		padding: 27,
		flexDirection: 'column'
	},
	modalXButton: {
		flex: 1,
		alignItems: 'flex-end'
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16
	},
	auxCenterView: {
		flex: 1
	},
	explanationText: {
		fontSize: 14,
		marginTop: 16,
		textAlign: 'center',
		...fontStyles.normal,
		color: colors.fontPrimary,
		lineHeight: 20
	},
	modalXIcon: {
		fontSize: 16
	}
};

const SeedphraseModal = ({ showWhatIsSeedphraseModal, hideWhatIsSeedphrase }) => (
	<ActionModal
		modalVisible={showWhatIsSeedphraseModal}
		actionContainerStyle={styles.modalNoBorder}
		displayConfirmButton={false}
		displayCancelButton={false}
		onRequestClose={hideWhatIsSeedphrase}
	>
		<View style={styles.modalContainer}>
			<View style={styles.titleContainer}>
				<View style={styles.auxCenterView} />
				<Text style={styles.whatIsSeedphraseTitle}>
					{strings('account_backup_step_1.what_is_seedphrase_title')}
				</Text>
				<TouchableOpacity
					onPress={hideWhatIsSeedphrase}
					style={styles.modalXButton}
					hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
				>
					<Icon name="times" style={styles.modalXIcon} />
				</TouchableOpacity>
			</View>
			<View>
				<Text style={styles.explanationText}>{strings('account_backup_step_1.what_is_seedphrase_text_1')}</Text>
				<Text style={styles.explanationText}>{strings('account_backup_step_1.what_is_seedphrase_text_2')}</Text>
				<Text style={styles.explanationText}>{strings('account_backup_step_1.what_is_seedphrase_text_2')}</Text>
			</View>
		</View>
	</ActionModal>
);

SeedphraseModal.propTypes = {
	/**
	/* Show or hide modal
	*/
	showWhatIsSeedphraseModal: PropTypes.bool,
	/**
	/* Function to hide modal
	*/
	hideWhatIsSeedphrase: PropTypes.func
};

export default SeedphraseModal;
