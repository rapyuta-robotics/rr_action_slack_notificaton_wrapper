#!/bin/bash

IFS=$'\n'
lines=($1)
dl=$(echo -en "\001");
for l in "${lines[@]}"
do
    key=$(echo $l | sed -e "s/\(.\+\)=\".\+\"/\1/g")
    val=$(echo $l | sed -e "s/.\+=\"\(.\+\)\"/\1/g")
    sed -e "s~%$key~$val~g" -i $2 || echo "Replacement failed for $l"
done