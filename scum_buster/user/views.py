from django.http import HttpResponse
from django.shortcuts import render
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from time import sleep
from user.models import scumBag
import secrets.config as config

#Root Page for Scum Search Functionality 
#It's only responsiblity is to view a search bar to the end user
def home(request):
    return render(request, 'user.html')

#Search Results Page for Scum Search Functionality 
#It should take in a user's display name OR steamId (custom or default), and return the corresponding steam profile
#OR, it should return a list of display names and avatars (almost identical to the steam profile search website) and allow the user to pin point who..
#the scum is
def scum_search(request):
    if request.method == 'GET':
        search_value = str(request.GET.get('search_value'))
        result = getScumbagProfileViaWeb(search_value) 
        print(result)
        return render(request, 'result.html', {'result':result})

#Confirms End Users search result, and redirects to a profile page where they can downvote to impact trustworthy factor 
def scum_profile(request, steamId):
    #Depending on which profile the End User clicks on, pass their STEAM ID through SCUM_PROFILE
    #Pseudocode:
        #First get "steamId" (custom or default) from scum_search
        #Pass it through
    if request.method == 'GET':
        print(steamId)
        scum = getScumbagProfileViaAPI(steamId)
        return render(request, 'profile.html', {'scum': scum })

#Downvotes a user and saves their information in a database
def scum_downvote(request, steamId):

    if request.method == 'POST' and str(request.GET.get('d') is 'true'):
        scumBag.objects.create()
    #Once downvote button is pressed
        #Save User Model in DB 
        #-1 to their trustfactor 
    
    #First need to check: does the user already exist in the database? --> If so, display current information 
        #Display Downvote Button
        #Display Trust Factor/Number of Reports 

    #else If user does not exist in database.. --> Once player clicks on downvote, save their information (model) to db     

    return 0


#Helper Functions 

#Web Scrape Steam Search Functionality - since we cannot query API via displayName
def getScumbagProfileViaWeb(searchInput):
    URL = "https://steamcommunity.com/search/users/#text=" + str(searchInput)
    #Testing Purposes Only: Looks like we'll need to install a webdriver on hostmachine if this goes live 
    #Please download appropirate version for your local machine: https://chromedriver.chromium.org/downloads
    driver = webdriver.Chrome(config.webdriver_path)
    driver.get(URL)
    page = requests.get(url=URL)
    #TODO: Add pagination 
    #Allow page to fully render
    sleep(5)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    searchRow = soup.find_all("div", class_="search_row")
    result = []
    for info in searchRow:
        data = info.find("div", class_="searchPersonaInfo").find("a", class_="searchPersonaName")
        profileLink = data.get("href")
        displayName = data.text
        #URL Looks different depending on whether they have custom steamId or default steamId
        if 'profiles' in profileLink:
            steamId =  str(profileLink).removeprefix('https://steamcommunity.com/profiles/')
        else: 
            steamId = str(profileLink).removeprefix('https://steamcommunity.com/id/')
        finalInfo = {"displayName":displayName, "profileLink":profileLink, "steamId":steamId}
        result.append(finalInfo)
    return result

#Query API via steamid 
def getScumbagProfileViaAPI(searchInput):
    #API Docs: https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0001.29
    steamId = str(searchInput)
    #Depending on which API is used - need to sanitize input differently and appropriately to get relevant information, in this case.. steamid
    #if custom steam id (i.e. not a 64bit number) --> use ResolveVanityURL
    if steamId.isdigit() == False:
        API_QUERY = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + config.api_key + "&vanityurl=" + steamId
        r = requests.get(API_QUERY)
        result = r.json()['response']
    #if steam id is normal (i.e. 64bit number) --> use GetPlayerSummaries ap
    if steamId.isdigit() == True and int(steamId).bit_length() <= 63:
        API_QUERY = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + config.api_key + "&steamids=" + steamId
        r = requests.get(API_QUERY)
        result = r.json()['response']['players'][0]
    return result
        
