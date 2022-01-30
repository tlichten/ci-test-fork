name: Gitty
description: Submit new input
title: "[Gitty]: "
labels: ["gitty"]
assignees:
  - octocat
body:
  - type: markdown
    attributes:
      value: |
        Please fill out the below form
  - type: input
    id: name
    attributes:
      label: Name
      description: Define the name of your VM
      placeholder: host-web-serv
    validations:
      required: true
  - type: dropdown
    id: memory
    attributes:
      label: Memory
      description: How much memory does your VM need?
      options:
        - 4GB
        - 8GB
    validations:
      required: true
  - type: checkboxes
    id: network
    attributes:
      label: Network
      description: Do you require public network access
      options:
        - label: I require public network access
          required: false
