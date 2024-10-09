import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class EmailSender:
    def __init__(self, host, port, user, password):
        self.email_host = host
        self.email_port = port
        self.email_host_user = user
        self.email_host_password = password

    def send_email(self, subject, recipient_list, html_message):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.email_host_user
        msg['To'] = ', '.join(recipient_list)

        part = MIMEText(html_message, 'html')
        msg.attach(part)
        
        try:
            server = smtplib.SMTP(self.email_host, self.email_port)
            server.set_debuglevel(1)
            server.starttls()  
            server.login(self.email_host_user, self.email_host_password)
            server.sendmail(self.email_host_user, recipient_list, msg.as_string())
            server.quit()
            return True
        except Exception as e:
            print(e)
            return False
