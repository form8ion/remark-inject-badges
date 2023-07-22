Feature: Inject

  Scenario: no existing badges, no badges to inject
    Given badge zones exist
    But no badges are provided for injection
    When a node is processed
    Then no badges were injected

  Scenario: no existing badges, new badges to inject
    Given badge zones exist
    And badges are provided for injection
    When a node is processed
    Then the provided badges were injected

  Scenario: badges exist, new badges to inject
    Given badge zones exist
    And badges are provided for injection
    And badges already exist in the document
    When a node is processed
    Then the additional badges were injected

  @wip
  Scenario: badges to inject already exist in document
    Given badge zones exist
    And badges are provided for injection
    But the provided badges already exist in the document
    When a node is processed
    Then no additional badges were injected

  @wip
  Scenario: updated details for badge already in the document
    Given badge zones exist
    And badges are provided for injection
    And the provided badge details are updates for existing badges in the document
    When a node is processed
    Then the existing badges were updated in the document
