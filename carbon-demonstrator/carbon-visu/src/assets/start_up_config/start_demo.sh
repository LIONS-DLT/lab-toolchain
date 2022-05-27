sleep 5
firefox --new-window localhost:80 &
sleep 10
(cd ~/minifabric/minifabric/ && ./minifab explorerdown) &
sleep 20
(cd ~/minifabric/minifabric/ && ./minifab explorerup) &
sleep 20
firefox --new-window http://192.168.1.1:7004 &
