Feature: Inject

  Scenario: no badges to inject
    Given badge zones exist
    But no badges are provided for injection
    When a node is processed
    Then no badges were injected

  Scenario: new badges to inject
    Given badge zones exist
    And badges are provided for injection
    When a node is processed
    Then the provided badges were injected
