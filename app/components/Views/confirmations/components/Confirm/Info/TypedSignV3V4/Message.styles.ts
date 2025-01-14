import { StyleSheet } from 'react-native';

import { Theme } from '../../../../../../../util/theme/models';
import { fontStyles } from '../../../../../../../styles/common';

const styleSheet = (params: { theme: Theme }) => {
  const { theme } = params;

  return StyleSheet.create({
    collpasedInfoRow: {
      marginStart: -8,
      paddingBottom: 4,
    },
    title: {
      color: theme.colors.text.default,
      ...fontStyles.normal,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
    },
  });
};

export default styleSheet;
