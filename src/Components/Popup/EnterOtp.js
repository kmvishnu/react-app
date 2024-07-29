import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Popup = ({ email, onClose, onVerifyOtp }) => {
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      const response = await onVerifyOtp(email, otp);
      if (response.status === 'otpSuccess') {
        setVerified(true);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
    }
    setVerifying(false);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };


  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{"OTP Verification"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {verified ? 'OTP verified successfully. You can now log in.' : 'An OTP has been sent to your email. Please enter it below to verify your account.'}
        </DialogContentText>
        {!verified && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={verifying}
            />
            {error && <Typography color="error">{error}</Typography>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {verified ? (
          <Button onClick={handleLoginRedirect} color="primary">
            Go to Login
          </Button>
        ) : (
          <Button onClick={handleVerify} color="primary" disabled={!otp || verifying}>
            {verifying ? 'Verifying...' : 'Verify'}
          </Button>
        )}
        {!verified && (
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
