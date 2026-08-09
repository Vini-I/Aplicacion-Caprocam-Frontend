import React from 'react';
import Badge from '../../../shared/components/Badge';
import { COLORS } from '../../../theme/colors';

export default function BadgeCategoria({ categoria }) {
  if (!categoria) return null;
  const value = String(categoria);
  let label = value;
  let variant = 'info';
  let style = null;
  let textStyle = null;

  if (value === 'preventivo') {
    label = 'Preventivo';
    variant = 'warning';
    style = { backgroundColor: COLORS.warningLight, borderColor: COLORS.warningLight };
    textStyle = { color: COLORS.black };
  } else if (value === 'correctivo') {
    label = 'Correctivo';
    variant = 'danger';
    style = { backgroundColor: COLORS.errorLight, borderColor: COLORS.errorLight };
    textStyle = { color: COLORS.black };
  } else if (value === 'predictivo') {
    label = 'Predictivo';
    variant = 'info';
    style = { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primaryLight };
    textStyle = { color: COLORS.black };
  }

  return <Badge label={label} variant={variant} style={style} textStyle={textStyle} />;
}
