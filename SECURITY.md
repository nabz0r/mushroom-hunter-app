# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Mushroom Hunter seriously. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** create a public GitHub issue
2. Email security@mushroomhunter.app with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your suggested fix (if any)

3. You can expect:
   - Acknowledgment within 24 hours
   - Regular updates on our progress
   - Credit in our security acknowledgments (if desired)

## Security Measures

### Authentication & Authorization
- JWT tokens with short expiration (15 min)
- Refresh tokens stored securely
- Role-based access control (RBAC)
- Rate limiting on auth endpoints

### Data Protection
- All data encrypted in transit (TLS 1.3)
- Sensitive data encrypted at rest
- PII anonymization for analytics
- Regular security audits

### API Security
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- CSRF tokens for state-changing operations

### Infrastructure
- WAF protection
- DDoS mitigation
- Regular security patches
- Intrusion detection system

## Bug Bounty Program

We offer rewards for responsibly disclosed vulnerabilities:

| Severity | Reward |
|----------|--------|
| Critical | €500-€2000 |
| High     | €200-€500  |
| Medium   | €50-€200   |
| Low      | €20-€50    |

### Scope
- Mushroom Hunter mobile apps (iOS/Android)
- API (api.mushroomhunter.app)
- Web dashboard (dashboard.mushroomhunter.app)

### Out of Scope
- Third-party services
- Social engineering
- Physical attacks
- DoS/DDoS attacks

## Security Checklist for Contributors

- [ ] Never commit secrets or API keys
- [ ] Use environment variables for sensitive data
- [ ] Validate all user inputs
- [ ] Use prepared statements for database queries
- [ ] Keep dependencies up to date
- [ ] Follow OWASP guidelines
- [ ] Test for common vulnerabilities

## Contact

security@mushroomhunter.app
PGP Key: [Download](https://mushroomhunter.app/pgp-key.asc)