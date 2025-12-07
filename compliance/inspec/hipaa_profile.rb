# HIPAA Compliance InSpec Profile

title 'HIPAA Security Rule Compliance'

control 'hipaa-1.1' do
  impact 1.0
  title 'Encryption at Rest'
  desc 'All PHI must be encrypted at rest using AES-256'
  
  describe file('/etc/encryption.conf') do
    it { should exist }
    its('content') { should match /AES-256/ }
  end
end

control 'hipaa-1.2' do
  impact 1.0
  title 'Encryption in Transit'
  desc 'All communications must use TLS 1.3'
  
  describe ssl(host: 'api.example.com', port: 443) do
    it { should be_enabled }
    its('protocols') { should include 'TLSv1.3' }
  end
end

control 'hipaa-2.1' do
  impact 1.0
  title 'Audit Logging'
  desc 'All PHI access must be logged'
  
  describe postgres_session('user', 'password', 'localhost').query('SELECT COUNT(*) FROM audit_logs WHERE action = \'PHI_ACCESS\'') do
    its('output') { should_not eq '0' }
  end
end

control 'hipaa-2.2' do
  impact 1.0
  title 'Audit Log Retention'
  desc 'Audit logs must be retained for at least 6 years'
  
  describe file('/var/log/audit') do
    it { should exist }
    it { should be_directory }
  end
end

control 'hipaa-3.1' do
  impact 1.0
  title 'Access Control'
  desc 'Role-based access control must be implemented'
  
  describe postgres_session('user', 'password', 'localhost').query('SELECT COUNT(*) FROM users WHERE role IS NOT NULL') do
    its('output') { should_not eq '0' }
  end
end

control 'hipaa-3.2' do
  impact 1.0
  title 'Multi-Factor Authentication'
  desc 'MFA must be enabled for all users accessing PHI'
  
  describe file('/etc/auth/mfa.conf') do
    it { should exist }
    its('content') { should match /enabled=true/ }
  end
end

control 'hipaa-4.1' do
  impact 1.0
  title 'Data Backup'
  desc 'Daily encrypted backups must be performed'
  
  describe command('aws s3 ls s3://medrx-backups/ | tail -1') do
    its('stdout') { should match /#{Time.now.strftime('%Y-%m-%d')}/ }
  end
end

control 'hipaa-5.1' do
  impact 0.8
  title 'Security Headers'
  desc 'HTTP security headers must be configured'
  
  describe http('https://api.example.com') do
    its('headers.X-Frame-Options') { should eq 'DENY' }
    its('headers.X-Content-Type-Options') { should eq 'nosniff' }
    its('headers.Strict-Transport-Security') { should match /max-age/ }
  end
end
