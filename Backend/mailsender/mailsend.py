
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email(to_email, password, subject,body):
    smtpHost = 'smtp.gmail.com'
    smtpPort = 587
    
    from_email ="meetchatshareinfo@gmail.com"
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(smtpHost, smtpPort)
        server.starttls() 
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print ("Successfully sent email")
    except  Exception as e:
         print(f"Failed to send email: {e}")



if __name__ == '__main__':
    #get the values frm node 
    password = sys.argv[1]
    to_email = sys.argv[2]
    subject = sys.argv[3]
    body = sys.argv[4]
    send_email(to_email,  password, subject,body)
