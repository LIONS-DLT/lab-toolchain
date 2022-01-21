# Carbon Accounting Demonstrator 

This document describes all artefacts for rebuilding the carbon accounting demonstrator of the LIONS research project. The demonstrator consists of five Raspberry Pi's and a pocket pc running as a fully decentralized cluster to operate a Hyperledger Fabric blockchain network. The following picture shows the simplified setup of the cluster.


<a href="https://www.raspberrypi.com/products/raspberry-pi-4-model-b/"> <img src="./pictures/pi-plug-in.gif" width="320" height="230"/><img src="./pictures/cluster.png" width="650" height="350"/></br><font size="1">Picture: https://www.raspberrypi.org/ </font>


1. [Bill of Materials (BOM)](#bill-of-materials-bom)
3. [Blockchain Network Setup](#blockchain-network-setup)
4. [Visualization](#visualization)

### Bill of Materials (BOM)
The following BOM lists the essential components for building the carbon demonstrator. Beside this BOM you may need further equipment such as, cables (ethernet, HDMI etc.), electrical wiring, buttons, 1-2 monitors and cable ties.

| Material                                     | Ammount | Reference                                                                                                                                       |
|----------------------------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| Raspberry Pi 4 B+ (min. 4GB RAM)             | 5       | <a href="https://www.raspberrypi.com/products/raspberry-pi-4-model-b/"> <img src="./pictures/pi.jpeg" width="80" height="50"/> </a>           |
| Raspberry Pi Power Supply                    | 5       | <a href="https://www.raspberrypi.com/products/type-c-power-supply/"> <img src="./pictures/power.jpeg" width="80" height="50"/> </a>           |
| Box + Cover (e.g. eurobox 22L; 40x60x12,5cm) | 1       | <a href="https://www.surplus-systems.de/produkte/euronormboxen/"> <img src="./pictures/box.png" width="80" height="50"/> </a>                 |
| Network Switch 8xports                       | 1       | <a href="https://www.netgear.com/de/business/wired/switches/unmanaged/gs108/"> <img src="./pictures/switch.png" width="80" height="50"/> </a> |
| Pocket PC                                    | 1       | e.g. Fujitsu Esprimo Q556/2                                                                                                                     |

### Blockchain Network Setup
The usage of [minifabric](https://github.com/hyperledger-labs/minifabric) allows very straight processes for structing the network and the consortium. The following example depicts the stepwise process of onboarding a new organization to the consortium.</br>
<img src="./pictures/nodes.png" width="800" height="400"/></br>
| Step | Description |
|------|-------------|
| 1    | To prepare the existing network for the joining process of a new peer, run the mini-fabric command “channelquery”. As a result, the channel configuration file will be created.            |
| 2    | Modify the spec.yaml on a different machine as described above and run the “netup” command. A single peer will be started.            |
| 3    | Copy the join request, which is created by the new peer, to the configuration file. After a majority of network peers have signed the new config file, run “chan-nelupdate” to update the network. Join the single peer with the “nodeimport” command. Now the new peer is connected to the network and the order service but is not a member of the channel yet.            |
| 4    | Install the chaincode on the joined peer. After this, run the “approve” command on every peer, so the chaincode is approved. Now you can run the “commit” command to commit the chaincode. During this process the chaincode container on the new peer should be started. Run a simple “invoke” command to check if everything work as expected.            |

### Visualization
PICTURE + Description 
#### Carbon Visu
PICTURE + Description 
<img src="./pictures/carbon_visu.gif" width="800" height="400"/></br>
#### Transaction Visu

