import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('')

WebUI.navigateToUrl('https://edu.google.com/intl/en-US/workspace-for-education/classroom/')

WebUI.click(findTestObject('Object Repository/Page_Classroom Management Tools  Resources _6440ed/span_Sign in to Classroom'))

WebUI.switchToWindowTitle('Sign in - Google Accounts')

WebUI.setText(findTestObject('Object Repository/Page_Sign in - Google Accounts/input_Use your Google Account_identifier'), 
    'duurenbayar.u@ulaanbaatar.edu.mn')

WebUI.click(findTestObject('Object Repository/Page_Sign in - Google Accounts/span_Next'))

WebUI.setEncryptedText(findTestObject('Object Repository/Page_Sign in - Google Accounts/input_Too many failed attempts_Passwd'), 
    'v26RzQFMVnVRuBgJN0KD8Q==')

WebUI.click(findTestObject('Object Repository/Page_Sign in - Google Accounts/div_Show password_VfPpkd-RLmnJb'))

WebUI.closeBrowser()

