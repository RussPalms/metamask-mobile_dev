@androidApp @regression @ChainScenarios

Feature: Permission system in MetaMask Mobile

    Scenario: Import wallet
        Given the app displayed the splash animation
        And I have imported my wallet
        And I tap No Thanks on the Enable security check screen
        And I tap No thanks on the onboarding welcome tutorial

    Scenario: User grants permission to a dapp to access one of their accounts
        When I navigate to the browser
        And I navigate to "https://metamask.github.io/test-dapp/"
        Then I connect my active wallet to the test dapp
    #     Then I should be connected to the dapp

    Scenario: User revokes dapp permission
        When I tap on the Network Icon
        And I tap on button with text "Permissions"
        # And I tap on button with text "connect multiple accounts"
        And I tap on button with text "Revoke"
        Then I should not be connected to the dapp