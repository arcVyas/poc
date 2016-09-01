#!/usr/bin/env bash
# author: mvyas

updateExpCom() {
      context=$1
      url="http://$server:$port/$context/cache/admin/remote-cache/off"
      echo "`date` : Switch EXP cache @ $url : `curl -s -I -X POST "$url"| grep HTTP/1.1 | awk {'print $2'}`" >> $logFile
      url="http://$server:$port/$context/cache/maps/exp-env-map/hzcast-cluster-seed-list"
      echo "`date` : Update SeedList EXP cache @ $url : `curl -s -I -X POST "$url"| grep HTTP/1.1 | awk {'print $2'}`" >> $logFile
      url="http://$server:$port/$context/cache/admin/remote-cache/on"
      echo "`date` : Update SeedList EXP cache @ $url : `curl -s -I -X POST "$url"| grep HTTP/1.1 | awk {'print $2'}`" >> $logFile
}

cacheRunner() {
  logFile="./cache-runner.log"
  echo "`date` : Starting flush-jvm script for system : $1" >> "$logFile"
  echo "`date` : Reading JVMs from file : ./exp-jvms.txt" >> "$logFile"
  cnt=0
  while read server port
  do
      if [[ ("$server" !=  "") && ("$port" !=  "") ]]; then
       updateExpCom("expcom")
       updateExpCom("expcom-api")
      fi
  done < ./exp-jvms.txt
}

# Script Begins
# Usgae : flush-jvm-cache <exp/atg>
echo "Starting cache-runner"

cacheRunner
wait
###############
rc=$?
if [ "$rc" != 0 ] ; then
	echo "Error on cache-runner !!!! Return code : $rc"
	exit $rc
fi

echo "Script execution completed.... Return code : $rc"
exit $rc
# Script Ends
