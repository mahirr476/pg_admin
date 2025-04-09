

/**
 * Validates an email address format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a phone number format (simple check)
   * @param phone Phone number to validate
   * @returns Boolean indicating if phone number is valid
   */
  export const isValidPhone = (phone: string): boolean => {
    // Allow digits, spaces, +, -, and parentheses
    const phoneRegex = /^[0-9+\-\(\)\s]+$/;
    return phoneRegex.test(phone) && phone.length >= 4 && phone.length <= 15;
  };
  
  /**
   * Check if text contains dangerous content like scripts or SQL injection attempts
   * @param text Text to check
   * @returns Boolean indicating if text might be malicious
   */
  export const containsMaliciousContent = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    
    // Check for script tags, SQL injection, etc.
    const dangerousPatterns = [
      '<script',
      'javascript:',
      'onerror=',
      'onclick=',
      'onload=',
      'select * from',
      'union select',
      'drop table',
      'alter table',
      '1=1',
      'or 1=1'
    ];
    
    return dangerousPatterns.some(pattern => lowerText.includes(pattern));
  };
  
  /**
   * Rate limiting helper (simple in-memory implementation)
   */
  const ipRequests = new Map<string, { count: number, timestamp: number }>();
  
  export const isRateLimited = (ip: string): boolean => {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = 10; // Max 10 requests per hour per IP
    
    const record = ipRequests.get(ip) || { count: 0, timestamp: now };
    
    // Reset if outside window
    if (now - record.timestamp > windowMs) {
      record.count = 1;
      record.timestamp = now;
      ipRequests.set(ip, record);
      return false;
    }
    
    // Check if over limit
    if (record.count >= maxRequests) {
      return true;
    }
    
    // Increment and update
    record.count++;
    ipRequests.set(ip, record);
    return false;
  };
  
  // Periodically clean up old IP records (every hour)
  setInterval(() => {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    
    for (const [ip, record] of ipRequests.entries()) {
      if (now - record.timestamp > windowMs) {
        ipRequests.delete(ip);
      }
    }
  }, 60 * 60 * 1000);