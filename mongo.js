// # mongod --nojournal
// # mongoimport --db stocks --collection price --type json --file stock_data.json 

// import looks good
> db.price.find()
{ "_id" : ObjectId("505dded4062e11e40afc5c46"), "symbol" : "AXP", "name" : "American Express ", "price" : 44.73, "dividend_yield" : 2.01, "p_e_ratio" : 14.6, "volume" : 500, "day_value_change" : 0, "previous_close" : 44.73, "last_trade_time" : ISODate("2011-01-06T16:00:00Z") }
{ "_id" : ObjectId("505dded4062e11e40afc5c48"), "symbol" : "BAC", "name" : "Bank of America C", "price" : 14.44, "dividend_yield" : 0.28, "p_e_ratio" : 0, "volume" : 2942961, "day_value_change" : 0, "previous_close" : 14.44, "last_trade_time" : ISODate("2011-01-06T16:02:00Z") }
{ "_id" : ObjectId("505dded4062e11e40afc5c49"), "symbol" : "BA", "name" : "Boeing Company (T", "price" : 68.8, "dividend_yield" : 2.44, "p_e_ratio" : 14.9, "volume" : 2810, "day_value_change" : 0, "previous_close" : 68.8, "last_trade_time" : ISODate("2011-01-06T16:01:00Z") }
{ "_id" : ObjectId("505dded4062e11e40afc5c4a"), "symbol" : "CAT", "name" : "Caterpillar, Inc.", "price" : 93.54, "dividend_yield" : 1.84, "p_e_ratio" : 30.74, "volume" : 2100, "day_value_change" : 0, "previous_close" : 93.54, "last_trade_time" : ISODate("2011-01-06T16:01:00Z") }
{ "_id" : ObjectId("505dded4062e11e40afc5c4b"), "symbol" : "CVX", "name" : "Chevron Corporati", "price" : 90.69, "dividend_yield" : 3.13, "p_e_ratio" : 10.84, "volume" : 100, "day_value_change" : 0, "previous_close" : 90.69, "last_trade_time" : ISODate("2011-01-06T16:00:00Z") }

// list symbols
> db.price.aggregate({"$group": {_id: 0, symbols: {"$addToSet": "$symbol"}}});
{
  "result" : [
    {
      "_id" : 0,
      "symbols" : [
        "WMT",
        "UTX",
        "DD",
        "AXP",
        "TRV",
        "PFE",
        "MRK",
        "MCD",
        "KFT",
        "VZ",
        "XOM",
        "JPM",
        "INTC",
        "IBM",
        "AA",
        "HD",
        "MSFT",
        "T",
        "DIS",
        "BAC",
        "CSCO",
        "HPQ",
        "MMM",
        "CVX",
        "CAT",
        "KO",
        "PG",
        "GE",
        "JNJ",
        "BA"
      ]
    }
  ],
  "ok" : 1
}

db.price.ensureIndex({symbol:1})

db.price.aggregate({"$project": {symbol: 1}}, {"$group": {_id: 0, symbols: {"$addToSet": "$symbol"}}});

//neither the index nor the project tag sped up this query (more or less the same)

db.price.aggregate({"$project": {symbol: 1}}, {"$group": {_id: "$symbol", counts: {"$sum": 1}}});

// list counts per symbol in whole collection
> db.price_from_csv.aggregate({"$project": {symbol: 1}}, {"$group": {_id: "$symbol", counts: {"$sum": 1}}});
{
	"result" : [
		{
			"_id" : "WMT",
			"counts" : 263888
		},
		{
			"_id" : "UTX",
			"counts" : 263888
		},
		{
			"_id" : "DD",
			"counts" : 263888
		},
		{
			"_id" : "AXP",
			"counts" : 263888
		},
		{
			"_id" : "TRV",
			"counts" : 263888
		},
		{
			"_id" : "PFE",
			"counts" : 263888
		},
		{
			"_id" : "MRK",
			"counts" : 263888
		},
		{
			"_id" : "MCD",
			"counts" : 263888
		},
		{
			"_id" : "KFT",
			"counts" : 263888
		},
		{
			"_id" : "VZ",
			"counts" : 263888
		},
		{
			"_id" : "XOM",
			"counts" : 263888
		},
		{
			"_id" : "JPM",
			"counts" : 263888
		},
		{
			"_id" : "INTC",
			"counts" : 263888
		},
		{
			"_id" : "IBM",
			"counts" : 263888
		},
		{
			"_id" : "AA",
			"counts" : 263888
		},
		{
			"_id" : "HD",
			"counts" : 263888
		},
		{
			"_id" : "MSFT",
			"counts" : 263888
		},
		{
			"_id" : "T",
			"counts" : 263888
		},
		{
			"_id" : "DIS",
			"counts" : 263888
		},
		{
			"_id" : "BAC",
			"counts" : 263888
		},
		{
			"_id" : "CSCO",
			"counts" : 263888
		},
		{
			"_id" : "HPQ",
			"counts" : 263888
		},
		{
			"_id" : "MMM",
			"counts" : 263888
		},
		{
			"_id" : "CVX",
			"counts" : 263888
		},
		{
			"_id" : "CAT",
			"counts" : 263888
		},
		{
			"_id" : "KO",
			"counts" : 263888
		},
		{
			"_id" : "PG",
			"counts" : 263888
		},
		{
			"_id" : "GE",
			"counts" : 263888
		},
		{
			"_id" : "JNJ",
			"counts" : 263888
		},
		{
			"_id" : "BA",
			"counts" : 262690
		}
	],
	"ok" : 1
}

// list counts per year for a symbol (obviously some bad dates got into the mix, interesting)
> db.price.aggregate({"$match": {symbol: "BA"}}, {"$project": {last_trade_time: 1}}, {"$group": {_id: {"$year": "$last_trade_time"}, count: {"$sum": 1}}});
{
	"result" : [
		{
			"_id" : 2012,
			"count" : 111276
		},
		{
			"_id" : 1970,
			"count" : 2
		},
		{
			"_id" : 2011,
			"count" : 151412
		}
	],
	"ok" : 1
}

// time for an index
> db.price.ensureIndex({last_trade_time:1})

// same again for all
> db.price.aggregate({"$project": {symbol: 1, last_trade_time: 1}}, {"$group": {_id: {"$year": "$last_trade_time"}, count: {"$sum": 1}}});
{
	"result" : [
		{
			"_id" : 2012,
			"count" : 3338278
		},
		{
			"_id" : 1970,
			"count" : 48
		},
		{
			"_id" : 2011,
			"count" : 4577116
		}
	],
	"ok" : 1
}

// look for the bad rows (1970)
> db.price.find({ last_trade_time: {"$lt":ISODate("2010-01-01T00:00:00.000Z")} })
{ "_id" : ObjectId("505ddfa6062e11e40a032916"), "symbol" : "MMM", "name" : "ompany Common Sto", "price" : 223658800, "dividend_yield" : 2.56, "p_e_ratio" : 43.21, "volume" : 3498040, "day_value_change" : 90.69, "previous_close" : 90.75, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa6062e11e40a032934"), "symbol" : "MMM", "name" : "ompany Common Sto", "price" : 223658800, "dividend_yield" : 2.56, "p_e_ratio" : 43.21, "volume" : 3498040, "day_value_change" : 90.69, "previous_close" : 90.75, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d7d"), "symbol" : "T", "name" : " Inc.", "price" : 223837152, "dividend_yield" : 21, "p_e_ratio" : 16.86, "volume" : 25700700, "day_value_change" : 28.43, "previous_close" : 28.5, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d7f"), "symbol" : "BA", "name" : "ng Company (The) ", "price" : 223842096, "dividend_yield" : 3.18, "p_e_ratio" : 43.25, "volume" : 5961360, "day_value_change" : 72.46, "previous_close" : 72.66, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d84"), "symbol" : "DIS", "name" : " Disney Company (", "price" : 223834224, "dividend_yield" : 2.12, "p_e_ratio" : 108.7, "volume" : 10490500, "day_value_change" : 43.38, "previous_close" : 43.48, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d85"), "symbol" : "DD", "name" : " du Pont de Nemou", "price" : 223828288, "dividend_yield" : 4.14, "p_e_ratio" : 44.41, "volume" : 6414850, "day_value_change" : 54.52, "previous_close" : 54.62, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d86"), "symbol" : "XOM", "name" : "n Mobil Corporati", "price" : 223838976, "dividend_yield" : 2.54, "p_e_ratio" : 47.39, "volume" : 20538500, "day_value_change" : 82.65, "previous_close" : 83.41, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d88"), "symbol" : "HPQ", "name" : "ett-Packard Compa", "price" : 223828416, "dividend_yield" : 1.35, "p_e_ratio" : 152.53, "volume" : 17942300, "day_value_change" : 48.52, "previous_close" : 48.81, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d89"), "symbol" : "HD", "name" : " Depot, Inc. (The", "price" : 223840032, "dividend_yield" : 6.81, "p_e_ratio" : 39.36, "volume" : 11546200, "day_value_change" : 37.1, "previous_close" : 37.155, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d8b"), "symbol" : "INTC", "name" : "l Corporation", "price" : 223838720, "dividend_yield" : 13.8, "p_e_ratio" : 33.24, "volume" : 54533600, "day_value_change" : 21.73, "previous_close" : 21.77, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d93"), "symbol" : "PG", "name" : "ter & Gamble Comp", "price" : 223838448, "dividend_yield" : 4.6, "p_e_ratio" : 33.65, "volume" : 10235700, "day_value_change" : 64.71, "previous_close" : 64.88, "last_trade_time" : ISODate("1970-01-01T19:01:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d80"), "symbol" : "CAT", "name" : "rpillar, Inc. Com", "price" : 223833680, "dividend_yield" : 1.68, "p_e_ratio" : 59.05, "volume" : 5715380, "day_value_change" : 102.38, "previous_close" : 102.75, "last_trade_time" : ISODate("1970-01-01T19:02:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d82"), "symbol" : "KO", "name" : "-Cola Company (Th", "price" : 223835840, "dividend_yield" : 4.35, "p_e_ratio" : 36.17, "volume" : 9558050, "day_value_change" : 63.47, "previous_close" : 63.66, "last_trade_time" : ISODate("1970-01-01T19:02:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d8c"), "symbol" : "JNJ", "name" : "son & Johnson Com", "price" : 223829632, "dividend_yield" : 5.66, "p_e_ratio" : 28.99, "volume" : 10984400, "day_value_change" : 60.9, "previous_close" : 61.16, "last_trade_time" : ISODate("1970-01-01T19:02:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033da0"), "symbol" : "KO", "name" : "-Cola Company (Th", "price" : 223835840, "dividend_yield" : 4.35, "p_e_ratio" : 36.17, "volume" : 9558050, "day_value_change" : 63.47, "previous_close" : 63.66, "last_trade_time" : ISODate("1970-01-01T19:02:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d95"), "symbol" : "UTX", "name" : "ed Technologies C", "price" : 223840112, "dividend_yield" : 2.36, "p_e_ratio" : 50.08, "volume" : 3661150, "day_value_change" : 85.1, "previous_close" : 85.13, "last_trade_time" : ISODate("1970-01-01T19:03:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d81"), "symbol" : "CVX", "name" : "ron Corporation C", "price" : 223829360, "dividend_yield" : 3.02, "p_e_ratio" : 34.21, "volume" : 7859110, "day_value_change" : 96.4, "previous_close" : 97.17, "last_trade_time" : ISODate("1970-01-01T19:04:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d7b"), "symbol" : "AA", "name" : "a Inc. Common Sto", "price" : 223827792, "dividend_yield" : 4.03, "p_e_ratio" : 144.92, "volume" : 28247700, "day_value_change" : 17.22, "previous_close" : 17.39, "last_trade_time" : ISODate("1970-01-01T19:06:00Z") }
{ "_id" : ObjectId("505ddfa7062e11e40a033d90"), "symbol" : "MRK", "name" : "k & Company, Inc.", "price" : 223836448, "dividend_yield" : 13.91, "p_e_ratio" : 21.77, "volume" : 18065100, "day_value_change" : 33.02, "previous_close" : 33.085, "last_trade_time" : ISODate("1970-01-01T19:06:00Z") }
{ "_id" : ObjectId("505de199062e11e40a210d32"), "symbol" : "MMM", "name" : "ompany Common Sto", "price" : 505544928, "dividend_yield" : 2.56, "p_e_ratio" : 42.99, "volume" : 3294730, "day_value_change" : 92.32, "previous_close" : 92.43, "last_trade_time" : ISODate("1970-01-01T20:01:00Z") }

> db.price.remove({ last_trade_time: {"$lt":ISODate("2010-01-01T00:00:00.000Z")} })

// multi-key group and sort
> db.price.aggregate({"$project": {symbol: 1, last_trade_time: 1}}, {"$group": {_id: {symbol: "$symbol", year: {"$year": "$last_trade_time"}}, count: {"$sum":1}}}, {"$sort": {_id: 1}});
{
	"result" : [
		{
			"_id" : {
				"symbol" : "AA",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "AA",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "AXP",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "AXP",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "BA",
				"year" : 2011
			},
			"count" : 151412
		},
		{
			"_id" : {
				"symbol" : "BA",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "BAC",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "BAC",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "CAT",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "CAT",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "CSCO",
				"year" : 2011
			},
			"count" : 152612
		},
		{
			"_id" : {
				"symbol" : "CSCO",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "CVX",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "CVX",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "DD",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "DD",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "DIS",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "DIS",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "GE",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "GE",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "HD",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "HD",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "HPQ",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "HPQ",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "IBM",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "IBM",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "INTC",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "INTC",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "JNJ",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "JNJ",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "JPM",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "JPM",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "KFT",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "KFT",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "KO",
				"year" : 2011
			},
			"count" : 152609
		},
		{
			"_id" : {
				"symbol" : "KO",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "MCD",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "MCD",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "MMM",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "MMM",
				"year" : 2012
			},
			"count" : 111275
		},
		{
			"_id" : {
				"symbol" : "MRK",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "MRK",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "MSFT",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "MSFT",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "PFE",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "PFE",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "PG",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "PG",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "T",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "T",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "TRV",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "TRV",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "UTX",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "UTX",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "VZ",
				"year" : 2011
			},
			"count" : 152612
		},
		{
			"_id" : {
				"symbol" : "VZ",
				"year" : 2012
			},
			"count" : 111275
		},
		{
			"_id" : {
				"symbol" : "WMT",
				"year" : 2011
			},
			"count" : 152611
		},
		{
			"_id" : {
				"symbol" : "WMT",
				"year" : 2012
			},
			"count" : 111276
		},
		{
			"_id" : {
				"symbol" : "XOM",
				"year" : 2011
			},
			"count" : 152610
		},
		{
			"_id" : {
				"symbol" : "XOM",
				"year" : 2012
			},
			"count" : 111276
		}
	],
	"ok" : 1
}

// using match (2012 only)
> db.price.aggregate({"$match": {last_trade_time: {"$gte":ISODate("2012-01-01T00:00:00.000Z")}}}, {"$group": {_id: "$symbol", count: {"$sum": 1}}});
{
	"result" : [
		{
			"_id" : "MMM",
			"count" : 111275
		},
		{
			"_id" : "UTX",
			"count" : 111276
		},
		{
			"_id" : "DD",
			"count" : 111276
		},
		{
			"_id" : "AXP",
			"count" : 111276
		},
		{
			"_id" : "TRV",
			"count" : 111276
		},
		{
			"_id" : "PFE",
			"count" : 111276
		},
		{
			"_id" : "MRK",
			"count" : 111276
		},
		{
			"_id" : "MCD",
			"count" : 111276
		},
		{
			"_id" : "KFT",
			"count" : 111276
		},
		{
			"_id" : "VZ",
			"count" : 111275
		},
		{
			"_id" : "XOM",
			"count" : 111276
		},
		{
			"_id" : "JPM",
			"count" : 111276
		},
		{
			"_id" : "INTC",
			"count" : 111276
		},
		{
			"_id" : "IBM",
			"count" : 111276
		},
		{
			"_id" : "AA",
			"count" : 111276
		},
		{
			"_id" : "HD",
			"count" : 111276
		},
		{
			"_id" : "MSFT",
			"count" : 111276
		},
		{
			"_id" : "BAC",
			"count" : 111276
		},
		{
			"_id" : "CSCO",
			"count" : 111276
		},
		{
			"_id" : "T",
			"count" : 111276
		},
		{
			"_id" : "DIS",
			"count" : 111276
		},
		{
			"_id" : "HPQ",
			"count" : 111276
		},
		{
			"_id" : "WMT",
			"count" : 111276
		},
		{
			"_id" : "PG",
			"count" : 111276
		},
		{
			"_id" : "GE",
			"count" : 111276
		},
		{
			"_id" : "JNJ",
			"count" : 111276
		},
		{
			"_id" : "CVX",
			"count" : 111276
		},
		{
			"_id" : "CAT",
			"count" : 111276
		},
		{
			"_id" : "KO",
			"count" : 111276
		},
		{
			"_id" : "BA",
			"count" : 111276
		}
	],
	"ok" : 1
}

// here's one that's actually a bit useful: Bank of America high/low/average price by week in 2012
> db.price.aggregate({"$match": {last_trade_time: {"$gte":ISODate("2012-01-01T00:00:00.000Z")}, symbol: "BA"}}, {"$group": {_id: {"$week":"$last_trade_time"}, high: {"$max": "$price"}, low: {"$min": "$price"}, avg: {"$avg": "$price"}}}, {"$sort":{_id:1}});
{
	"result" : [
		{
			"_id" : 1,
			"high" : 74.98,
			"low" : 72.79,
			"avg" : 73.99888326980202
		},
		{
			"_id" : 2,
			"high" : 75.68,
			"low" : 74.17,
			"avg" : 74.78443128234832
		},
		{
			"_id" : 3,
			"high" : 75.981,
			"low" : 74.83,
			"avg" : 75.4167605833319
		},
		{
			"_id" : 4,
			"high" : 76.312,
			"low" : 72.96,
			"avg" : 75.23588637120919
		},
		{
			"_id" : 5,
			"high" : 76.73,
			"low" : 73.69,
			"avg" : 75.07820737403995
		},
		{
			"_id" : 6,
			"high" : 75.9,
			"low" : 74.325,
			"avg" : 75.17866743023808
		},
		{
			"_id" : 7,
			"high" : 75.96,
			"low" : 74.78,
			"avg" : 75.24222214802415
		},
		{
			"_id" : 8,
			"high" : 76.636,
			"low" : 75.09,
			"avg" : 75.92514222592771
		},
		{
			"_id" : 9,
			"high" : 75.76,
			"low" : 74.661,
			"avg" : 75.09111806064543
		},
		{
			"_id" : 10,
			"high" : 74.9501,
			"low" : 72.3,
			"avg" : 73.6226790136067
		},
		{
			"_id" : 11,
			"high" : 75.79,
			"low" : 73.2,
			"avg" : 74.7180465488498
		},
		{
			"_id" : 12,
			"high" : 75.68,
			"low" : 73.39,
			"avg" : 74.69681463821372
		},
		{
			"_id" : 13,
			"high" : 75.27,
			"low" : 73,
			"avg" : 74.48685070187024
		},
		{
			"_id" : 14,
			"high" : 75.4645,
			"low" : 73.3,
			"avg" : 74.13860771929662
		},
		{
			"_id" : 15,
			"high" : 73.77,
			"low" : 70.6,
			"avg" : 72.4210965729701
		},
		{
			"_id" : 16,
			"high" : 74.36,
			"low" : 72.325,
			"avg" : 73.49481252923461
		},
		{
			"_id" : 17,
			"high" : 77.54,
			"low" : 72.17,
			"avg" : 75.31753740765522
		},
		{
			"_id" : 18,
			"high" : 77.82,
			"low" : 75.52,
			"avg" : 76.7284854496451
		},
		{
			"_id" : 19,
			"high" : 76.04,
			"low" : 73.28,
			"avg" : 74.55083031416956
		},
		{
			"_id" : 20,
			"high" : 73.76,
			"low" : 68.94,
			"avg" : 71.73182498332316
		},
		{
			"_id" : 21,
			"high" : 72.18,
			"low" : 69.67,
			"avg" : 70.88400550458809
		},
		{
			"_id" : 22,
			"high" : 70.4825,
			"low" : 67.1999,
			"avg" : 69.18734449999921
		},
		{
			"_id" : 23,
			"high" : 70.3,
			"low" : 66.84,
			"avg" : 68.64987898599199
		},
		{
			"_id" : 24,
			"high" : 72.79,
			"low" : 69.84,
			"avg" : 71.68434567901214
		},
		{
			"_id" : 25,
			"high" : 73.59,
			"low" : 71.1,
			"avg" : 72.26916556666535
		},
		{
			"_id" : 26,
			"high" : 74.36,
			"low" : 70.5,
			"avg" : 71.82509259752993
		},
		{
			"_id" : 27,
			"high" : 74.74,
			"low" : 72.5,
			"avg" : 73.90557605868787
		},
		{
			"_id" : 28,
			"high" : 75.02,
			"low" : 70.92,
			"avg" : 72.89437934022011
		},
		{
			"_id" : 29,
			"high" : 75.07,
			"low" : 72.0631,
			"avg" : 73.68273189856532
		},
		{
			"_id" : 30,
			"high" : 75.93,
			"low" : 71.37,
			"avg" : 73.76041403333438
		},
		{
			"_id" : 31,
			"high" : 75.55,
			"low" : 71.23,
			"avg" : 73.37943595468138
		},
		{
			"_id" : 32,
			"high" : 74.69,
			"low" : 72.72,
			"avg" : 74.03845807204802
		},
		{
			"_id" : 33,
			"high" : 74.43,
			"low" : 72.76,
			"avg" : 73.7013437333349
		},
		{
			"_id" : 34,
			"high" : 74.325,
			"low" : 70.04,
			"avg" : 72.34569156666593
		},
		{
			"_id" : 35,
			"high" : 71.95,
			"low" : 70.53,
			"avg" : 71.3327890464269
		},
		{
			"_id" : 36,
			"high" : 73.25,
			"low" : 70.4199,
			"avg" : 71.99506040016878
		},
		{
			"_id" : 37,
			"high" : 72.39,
			"low" : 70.4651,
			"avg" : 71.27986476666649
		},
		{
			"_id" : 38,
			"high" : 70.7,
			"low" : 69.04,
			"avg" : 69.96584609175824
		}
	],
	"ok" : 1
}

// use sorting to find extremes
// high by week
> db.price.aggregate({"$match": {last_trade_time: {"$gte":ISODate("2012-01-01T00:00:00.000Z")}, symbol: "BA"}}, {"$group": {_id: {"$week":"$last_trade_time"}, high: {"$max": "$price"}, low: {"$min": "$price"}, avg: {"$avg": "$price"}}}, {"$sort":{high:-1}}, {"$group": {_id: 0, high: {"$first":"$high"}, week: {"$first": "$_id"}}});
{
	"result" : [
		{
			"_id" : 0,
			"high" : 77.82,
			"week" : 18
		}
	],
	"ok" : 1
}

// low by week
> db.price.aggregate({"$match": {last_trade_time: {"$gte":ISODate("2012-01-01T00:00:00.000Z")}, symbol: "BA"}}, {"$group": {_id: {"$week":"$last_trade_time"}, high: {"$max": "$price"}, low: {"$min": "$price"}, avg: {"$avg": "$price"}}}, {"$sort":{low:1}}, {"$group": {_id: 0, low: {"$first":"$low"}, week: {"$first": "$_id"}}});
{
	"result" : [
		{
			"_id" : 0,
			"low" : 66.84,
			"week" : 23
		}
	],
	"ok" : 1
}










