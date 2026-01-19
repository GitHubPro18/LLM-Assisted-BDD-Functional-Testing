Feature: Generated Feature

@happy
Scenario: Successful login
Given open page "login"
When login "valid_user"
Then see message "Welcome"

@happy
Scenario: Successful login displays products page
Given open page
When login with valid credentials
Then see message

@happy
Scenario: Successful login
