

export const getErrorMessage = (error) => {
    if (error.message.includes('Requests with swears or nudity')) {
      return 'Your request contains inappropriate content. Please try again with a different prompt.';
    } else if (error.message.includes('HTTP error')) {
      return 'There was an issue connecting to the server. Please try again later.';
    } else if (error.message.includes('You do not have enough ADA')) {
      return 'You do not have enough ADA in your wallet to complete the transaction.';
    } else if (error.message.includes('Rejected the TX')) {
      return 'Transaction was rejected. Please try again.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  };
  