
export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Dhaka'
    });
  };
  
