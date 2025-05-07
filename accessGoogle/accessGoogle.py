# imports
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os, json

# GLOBALS
SCOPES = [
                "https://spreadsheets.google.com/feeds",
                "https://www.googleapis.com/auth/drive"
         ]

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CREDENTIALS_PATH = os.path.join(DATA_DIR, "drive-creds.json")


# PARENT CLASS - BASIC FUNCTIONS
class accessGoogle:
    # INIT
    def __init__(self):
        pass
        
    # AUTHENTICATE
    def authenticate(self):
        try:
            # FILE CHECK / SANITY TEST
            if os.path.exists(CREDENTIALS_PATH):
                # SIGN IN
                creds_info = json.load(CREDENTIALS_PATH)
                creds = Credentials.from_service_account_info(creds_info, scopes=SCOPES)
                drive = build('drive', 'v3', credentials=creds)
                
                return drive
                
        except Exception as e:
            print(f'Failed to authenticate sheet. Error: {e}')
            



# get names from scheduling sheet
    # row and formatting -- NEW NAME HERE''
    # define startingg location and end conditotion
    
# add clockin

# add clock out

# add lunch in 

# lunch out 

#  set up sheet to handle inputs and such

# TODO: 
#  - local state mgmt and data control




# GOAL: acess and authenticate sheets
# easily pull data from any sheet location