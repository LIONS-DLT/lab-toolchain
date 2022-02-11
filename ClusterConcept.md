# Concept for a Modular Research Scenario Private Blockchain Platform

## Introduction

As part of the Project LIONS [Ledger Innovation and Operation Network for Sovereignty](https://www.unibw.de/lions) we plan to offer a managed permission Blockchain platform (some may describe it as Blockchain-as-a-Service) targeted specifically at research groups or institutions. The main idea is this: Focus on the value and create your smart contracts, tokens and blockchain-enabled applications and use our infrastructure and provisioning mechanisms to experiment with different network sizes and configurations.

A specific challenge for industry and research groups alike is that they do not have the required time and know-how to operate a Hyperledger Fabric platform. This usually means that one has to use cloud services (e.g. Amazon AWS, IBM Blockchain Platform, Microsoft Azure etc.) to setup their configurations. This is usually relatively easy, however there are still risks and limitations: Machine Sizes are predefined, there is little (or no) bandwidth or latency control - to use for stress tests and so on. Guidance for scaling and fine tuning the Fabric platform itself is scarce and usually not the research focus. For those who do have this focus we also plan to offer a parameterized setup for larger scale performance tests.

## High-level Platform Architecture

From the infrastructure perspective we have the following components

| Component name   |      Layer      |  Technology description  | Details |
|----------|:-------------|------:|:------:|
| Physical node |  Physical | DELL Server | The physical servers|
| Storage nodes | Physical | NetApp Storage appliance | used for storing development-related data, container and virtual machine images |
| Container platform |   virtualization platform   |  RedHat OpenShift Container Platform (OCP)| Locally hosted edition of the OCP |
| Orchestration | container virtualization |  Kubernetes | Hosts and controls all services. It wraps containers in units called _pods_ |
| Individual containers| container | docker | Applications and other solution components run on containers |
| Virtual machines | operating system guest virtualization | VMware, Hyper-V and VirtualBox images supported | Virtual Machines can also be hosted alongside containers on our platform. Some legacy applications cannot be immediately ported to container technology or there are other isolation requirements |

WORK IN PROGRESS:  Diagram for the platform overview

## DevOps and CI/CD support for development :arrows_counterclockwise:

The OpenShift Container Platform is designed for easy development and integration with common CI/CD-tools.

## Actors and Organizations

This section provides an overview of the actor types used as a basis for 

For the scenario IT Supply Chain - development of complex software and cyber-physical systems - we have identified the following types of actos.

## Scenario Architectures and Categories

tbd