+++
title = "Dynamo DBがエクスポートしたデータをAthenaで検索する"
date = "2021-03-21"
tags = ["Dynamo DB", "Athena"]
+++

### Dynamo DBのエクスポート

Dynamo DBのエクスポート機能で出力するとjsonのデータが圧縮されてS3に保存される。試しに入れ子構造のあるデータを用意してデータを出力してみると、そのjsonはこんなものになる。

```
{"Item":{"Id":{"S":"order-245-0343447-999530"},"address":{"M":{"building":{"S":"シャルム"},"city":{"S":"川崎市川崎区"},"company":{"S":"合同会社池田ガス"},"name":{"S":"伊藤 洋介"},"phone":{"S":"090-5969-4263"},"prefecture":{"S":"大分県"},"town":{"S":"東浅草"},"zip":{"S":"331-0913"}}},"email":{"S":"zsato@example.org"},"items":{"L":[{"M":{"descr":{"S":"敵対的な電話欠乏軸緩む目的スペル"},"ean":{"S":"4616676941712"},"name":{"S":"NET-CHA-233"},"price":{"S":"5138"},"sku":{"S":"233"}}},{"M":{"descr":{"S":"ジャムクルー必要脊椎"},"ean":{"S":"6498635626162"},"name":{"S":"CEN-GOO-190"},"price":{"S":"62493"},"sku":{"S":"190"}}},{"M":{"descr":{"S":"トーストあった見出しリンク"},"ean":{"S":"5332220493665"},"name":{"S":"GRE-BOR-784"},"price":{"S":"43201"},"sku":{"S":"784"}}}]},"order_date":{"S":"2020-10-27"},"order_datetime":{"S":"2020-10-27T09:27:26+09:00"},"order_time":{"S":"09:27:26"},"pay_datetime":{"S":"2020-10-29T14:53:12+09:00"},"ship_datetime":{"S":"2020-10-28T09:27:26+09:00"}}}
{"Item":{"Id":{"S":"order-245-0342857-469872"},"address":{"M":{"building":{"S":"コート"},"city":{"S":"東大和市"},"company":{"S":"前田銀行有限会社"},"name":{"S":"田中 太一"},"phone":{"S":"29-8547-7889"},"prefecture":{"S":"山口県"},"town":{"S":"山中新田"},"zip":{"S":"265-6725"}}},"email":{"S":"momokosato@example.com"},"items":{"L":[{"M":{"descr":{"S":"教会電池パーセント出演者出演者電話"},"ean":{"S":"5472514763231"},"name":{"S":"CUR-SUB-236"},"price":{"S":"89575"},"sku":{"S":"236"}}},{"M":{"descr":{"S":"厳しい合計バスケットない血まみれの副"},"ean":{"S":"1417209380847"},"name":{"S":"LAW-RES-903"},"price":{"S":"29022"},"sku":{"S":"903"}}}]},"order_date":{"S":"2020-09-09"},"order_datetime":{"S":"2020-09-09T02:30:46+09:00"},"order_time":{"S":"02:30:46"},"pay_datetime":{"S":"2020-09-17T07:59:46+09:00"},"ship_datetime":{"S":"2020-09-12T02:30:46+09:00"}}}
{"Item":{"Id":{"S":"order-102-0342939-452759"},"address":{"M":{"building":{"S":"ハイツ"},"city":{"S":"新宿区"},"company":{"S":"吉田電気有限会社"},"name":{"S":"伊藤 浩"},"phone":{"S":"070-4957-8719"},"prefecture":{"S":"島根県"},"town":{"S":"木立"},"zip":{"S":"330-4315"}}},"email":{"S":"jyamamoto@example.net"},"items":{"L":[{"M":{"descr":{"S":"供給数字編組葉協力舗装虐待"},"ean":{"S":"6981477241407"},"name":{"S":"WHI-REC-570"},"price":{"S":"2317"},"sku":{"S":"570"}}},{"M":{"descr":{"S":"中世追放する管理するマリン近代化するジャーナル"},"ean":{"S":"2968886103926"},"name":{"S":"INT-BIL-135"},"price":{"S":"63827"},"sku":{"S":"135"}}}]},"order_date":{"S":"2020-08-25"},"order_datetime":{"S":"2020-08-25T11:13:46+09:00"},"order_time":{"S":"11:13:46"},"pay_datetime":{"S":"9999-12-31T00:00:00+09:00"},"ship_datetime":{"S":"9999-12-31T00:00:00+09:00"}}}
```

見やすくフォーマットすると一つの行はこんな風にDynamo DBの"S"とか"M"などが付いたJsonになっている。

```
{
   "Item":{
      "Id":{
         "S":"order-245-0343447-999530"
      },
      "address":{
         "M":{
            "city":{
               "S":"川崎市川崎区"
            },
            "name":{
               "S":"伊藤 洋介"
            }
         }
      },
      "items":{
         "L":[
            {
               "M":{
                  "price":{
                     "S":"5138"
                  },
                  "sku":{
                     "S":"233"
                  }
               }
            },
            {
               "M":{
                  "price":{
                     "S":"62493"
                  },
                  "sku":{
                     "S":"190"
                  }
               }
            }
         ]
      }
   }
}
```

これをAthenaでクエリできるようにテーブルを作りたい。
CDKでテーブルを作る場合はGlueに対してテーブルを作る事になる。
それがどんなコードになるか、というサンプルを作った。

## CDKのコード

サンプルの[Githubのリポジトリ](https://github.com/suzukiken/cdkgluetable-dynamoexport)

## Glueのテーブル定義部分について

CDKでのGlueのテーブル定義は、入れ子部分はなかなか面倒くさい記述が必要になっている。
GlueではなくAthenaでテーブルを作る場合も、
ほぼ同様に[こんな風](https://gist.github.com/suzukiken/79177cf0af6eedb5c73216ef09ccd3c0)にかなり面倒なコードになる。

書いていて頭がこんがらがってしまうのだが、ここを通り越せばあとはAthenaでクエリができるようになる。

## Athenaでクエリ

Athenaでクエリをする場合SQLはこのようになる。

```
SELECT * FROM cdkgluetabledynamoexport_table where item.id.s = 'order-245-0343447-999530';
SELECT item.id.s, item.address.m.name.s, item.items.l[1].m.sku.s FROM cdkgluetabledynamoexport_table limit 10;
SELECT item.id.s, item.address.m.name.s, product.m.sku.s FROM cdkgluetabledynamoexport_table CROSS JOIN UNNEST(item.items.L) AS unnested (product) limit 10;
```

ポイント

* [配列にアクセスするには](https://docs.aws.amazon.com/athena/latest/ug/accessing-array-elements.html) は`items[1]`のようにする。これは0ではなく1からカウントされる。
* [配列を展開するには](https://docs.aws.amazon.com/athena/latest/ug/flattening-arrays.html) `UNNEST`を使う。

## 試す

testディレクトリにサンプルデータを置いてあるので、
それを解凍してテーブルの定義で指定したS3バケットに配置すると、
実際に試してみることができる。

```
cd test
gunzip sample.json.gz
aws s3 cp sample.json s3://bucket/path
```