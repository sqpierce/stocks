#!/bin/bash

# has been running approx 1.5 yrs every minute while NYSE is open

DIR=~/projects/stocks/data
hour=`date -u +%H`
day=`date -u +%u`
file=$DIR/`date -u +%F`
# Dow Jones stock symbols
syms="MMM+AA+AXP+T+BAC+BA+CAT+CVX+KO+CSCO+DIS+DD+XOM+GE+HPQ+HD+IBM+INTC+JNJ+JPM+KFT+MCD+MRK+MSFT+PFE+PG+TRV+UTX+VZ+WMT"

# Yahoo finance stock format: http://dirk.eddelbuettel.com/code/yahooquote.html
#symbol, name, last trade date, last trade time, last trade price, dividend yield, P/E ratio, volume, day's value change, previous close
fmt="snd1t1l1yrvw1p"
url="http://download.finance.yahoo.com/d/quotes.csv?s="$syms"&f="$fmt

log (){
  echo "#("`date -u`")" $1 >>$file
}

dostock (){
  log "file "$file" hour "$hour" day "$day" dir "$DIR
  log "using command: curl $url"
  curl $url >>$file
}
# note that $hour throws error when 08 or 09 because interpreted as octal - need to investigate
# just changing to 8 or 9 as string using below doesn't seem to fix problem (or, rather, creates another problem
# hour=`date -u +%H`|sed 's/^0*//'
# doesn't matter as we're using UTC, so those hours are out of range
if (( $hour > 12 && $hour < 23 && $day < 6 ))
then
  dostock
fi

