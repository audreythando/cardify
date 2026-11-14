import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { PASSWORD_RULES } from '../../utils/validation';

/** Live checklist of password rules; each ticks green as it is satisfied. */
const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1, display: 'grid', gap: 0.4 }}>
    {PASSWORD_RULES.map((rule) => {
      const met = rule.test(password);
      const Icon = met ? CheckCircleRoundedIcon : RadioButtonUncheckedRoundedIcon;
      return (
        <Box component="li" key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Icon sx={{ fontSize: 14, color: met ? '#00D4AA' : 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontSize: '0.72rem', color: met ? '#00D4AA' : 'text.secondary' }}>
            {rule.label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

export default PasswordRequirements;
