# Concept for a Modular Research Scenario Private Blockchain Platform

## Changelog
| Date | Revision | Author |
|------|----------|-------|
|11.02.2022| V0.1| Razvan Hrestic (razvan.hrestic@unibw.de)|
|27.02.2022| V0.2| Razvan Hrestic (razvan.hrestic@unibw.de)|

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

![Diagram for the platform overview](assets/diagrams/DemonstratorConcept.jpg)

## :arrows_counterclockwise: DevOps and CI/CD support for development 

The OpenShift Container Platform is designed for easy development and integration with common CI/CD-tools.

## :busts_in_silhouette: Actors and Organizations

This section provides an overview of the actor types used as a basis for implementing the underlying concepts. The goals and interests of these actors influence the system design.

For the scenario IT Supply Chain - development of complex software and cyber-physical systems - we have identified the following types of actors, grouped by system type.

### Inhouse Projects

| Actor  |  Details |
|----------|:-------------|
| Requiring organization| An entity - either private or public - which has the need for developing the new system.|
| Purchasing department| Handles supplier selection and ordering|
| Software Supplier| Organization (or individual) supplying third party software components.|
| Hardware Supplier | Organization (or individual) supplying third party hardware components.|
| Freelancer| Professionals involved in the development process for software intensive systems as external contractors. |
| Auditing organization| Independent certification organizations involved in e.g. certifiying the compliance of suppliers to specific standards - usually industry-specific norms.|
| Software/Hardware Developer| Organization-internal or external professionals who are tasked with implementing the required system functionality.|
| Quality Assurance (QA)| Professionals (internal or external) tasked with monitoring and reporting quality metrics.|
| Risk Management| Professionals tasked with assessing and monitoring project risks during the implementation phase, but also during operations.|
| Project Management| Professionals tasked with planning the project and monitoring progress. |
| System Analysts| Professionals tasked with eliciting and documenting system requirements. |
| Operators / Sysadmins| Professionals tasked with making sure the system is up and running correctly. They perform monitoring, maintenance and troubleshooting tasks. |
| Support| Single Point of Contact for system users during operational phase. The support organization makes sure that user queries are being answered and Change Requests are being tracked and implemented. |
| (Software- and Solution) Architects| Professionals tasked with designing the system, breaking it up into manageable components as well as making sure that stakeholder concerns are being addressed.|
| Sales organization| Organizational unit (internal or outsourced) tasked with selling the end-product after development.|

### Public Interest Systems

🚧 This section is currently under construction.

| Actor  |  Details |
|----------|:-------------|
|(Project) impulse giver| e.g. Startups, ventures of public/private enterprises, research organizations, R&D departments etc.|

## Scenario Architectures and Categories

Our high-level system architec