# Index & Autocomplete

Create ES index that will serve autocomplete needs with leveraging typos and errors (max 3 typos if word length is bigger than 7).
Please use english voc. Ang look at google as a ref.

## Install

```
docker compose up
```

## Add custom tokenizer of `ngram` type, custom analyzer, that uses it and mapping for the `name` field

```
curl --location --request PUT 'localhost:9200/words' \
--header 'Content-Type: application/json' \
--data '{
  "settings": {
    "index": {
      "max_ngram_diff": 2
    },
    "analysis": {
      "tokenizer": {
        "autocomplete_tokenizer": {
          "type": "ngram",
          "min_gram": 2,
          "max_gram": 4
        }
      },
      "analyzer": {
        "custom_autocomplete": {
          "type": "custom",
          "tokenizer": "autocomplete_tokenizer",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "custom_autocomplete"
      }
    }
  }
}'
```

## Insert test data (randomly generated words by ChatGPT)

```
curl --location --request POST 'localhost:9200/_bulk' \
--header 'Content-Type: application/x-ndjson' \
--data-binary '@words.json'
```

## Testing

### Exact match

```
curl --location --request GET 'localhost:9200/words/_search?pretty' \
--header 'Content-Type: application/json' \
--data '{
    "size": 5,
    "query": {
        "match": {
            "name": {
                "query": "aberration"
            }
        }
    }
}'
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 137,
      "relation" : "eq"
    },
    "max_score" : 76.36404,
    "hits" : [
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "zIZdwIkBy7Vzp6h93i-w",
        "_score" : 76.36404,
        "_source" : {
          "name" : "aberration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "mIZdwIkBy7Vzp6h93jCy",
        "_score" : 28.98442,
        "_source" : {
          "name" : "underrated"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "VoZdwIkBy7Vzp6h93jCx",
        "_score" : 27.136005,
        "_source" : {
          "name" : "operational"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "6IZdwIkBy7Vzp6h93i-w",
        "_score" : 25.388596,
        "_source" : {
          "name" : "celebration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "-oZdwIkBy7Vzp6h93i-w",
        "_score" : 20.374357,
        "_source" : {
          "name" : "correlation"
        }
      }
    ]
  }
}
```

### 1 Typo

```
 curl --location --request GET 'localhost:9200/words/_search?pretty' \
--header 'Content-Type: application/json' \
--data '{
    "size": 5,
    "query": {
        "match": {
            "name": {
                "query": "aberation"
            }
        }
    }
}'
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 136,
      "relation" : "eq"
    },
    "max_score" : 50.4304,
    "hits" : [
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "zIZdwIkBy7Vzp6h93i-w",
        "_score" : 50.4304,
        "_source" : {
          "name" : "aberration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "VoZdwIkBy7Vzp6h93jCx",
        "_score" : 33.664986,
        "_source" : {
          "name" : "operational"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "6IZdwIkBy7Vzp6h93i-w",
        "_score" : 25.388596,
        "_source" : {
          "name" : "celebration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "kYZdwIkBy7Vzp6h93jCy",
        "_score" : 18.756027,
        "_source" : {
          "name" : "termination"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "04ZdwIkBy7Vzp6h93i-w",
        "_score" : 17.876059,
        "_source" : {
          "name" : "allegation"
        }
      }
    ]
  }
}
```

### 2 Typos

```
 curl --location --request GET 'localhost:9200/words/_search?pretty' \
--header 'Content-Type: application/json' \
--data '{
    "size": 5,
    "query": {
        "match": {
            "name": {
                "query": "aberatiom"
            }
        }
    }
}'
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 138,
      "relation" : "eq"
    },
    "max_score" : 44.135975,
    "hits" : [
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "zIZdwIkBy7Vzp6h93i-w",
        "_score" : 44.135975,
        "_source" : {
          "name" : "aberration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "VoZdwIkBy7Vzp6h93jCx",
        "_score" : 27.676,
        "_source" : {
          "name" : "operational"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "6IZdwIkBy7Vzp6h93i-w",
        "_score" : 19.399609,
        "_source" : {
          "name" : "celebration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "zoZdwIkBy7Vzp6h93i-w",
        "_score" : 14.91918,
        "_source" : {
          "name" : "accelerate"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "E4ZdwIkBy7Vzp6h93jCx",
        "_score" : 14.91918,
        "_source" : {
          "name" : "enumerated"
        }
      }
    ]
  }
}
```

### 3 Typos

```
 curl --location --request GET 'localhost:9200/words/_search?pretty' \
--header 'Content-Type: application/json' \
--data '{
    "size": 5,
    "query": {
        "match": {
            "name": {
                "query": "abaratiom"
            }
        }
    }
}'
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 125,
      "relation" : "eq"
    },
    "max_score" : 23.122557,
    "hits" : [
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "zIZdwIkBy7Vzp6h93i-w",
        "_score" : 23.122557,
        "_source" : {
          "name" : "aberration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "6IZdwIkBy7Vzp6h93i-w",
        "_score" : 19.399609,
        "_source" : {
          "name" : "celebration"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "VoZdwIkBy7Vzp6h93jCx",
        "_score" : 19.399609,
        "_source" : {
          "name" : "operational"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "KoZdwIkBy7Vzp6h93jCx",
        "_score" : 13.311997,
        "_source" : {
          "name" : "gratifying"
        }
      },
      {
        "_index" : "words",
        "_type" : "_doc",
        "_id" : "04ZdwIkBy7Vzp6h93i-w",
        "_score" : 11.581633,
        "_source" : {
          "name" : "allegation"
        }
      }
    ]
  }
}
```