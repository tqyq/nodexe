#!/bin/bash
csv="/tmp/loadavg.csv"
> $csv
list="gp01 gp02 gp03 gp04 saas dock1 dock2 dock3 dock5 vt001 vt002 vt003"
for i in $list
do
	arr=`ssh $i cat /proc/loadavg`
	str=`echo $arr|sed 's/ /,/g'`
	echo "$i,$str" >> $csv
done
psql -U gpadmin -h gp01 -c "truncate loadavg"
psql -U gpadmin -h gp01 -c "\copy loadavg from $csv csv"