# Example CDK TypeScript Project

To deploy AWS ApiGateway which responds source ip address.

## Install and deploy

* `npm install`
* `cdk deploy`

## description

https://note.figmentresearch.com/aws/cdkgluetable-dynamoexport

## How to try

```
cd test
gunzip sample.json.gz
aws s3 cp sample.json s3://<bucket name>/data/
```

### sample query on Athena

```
SELECT * FROM cdkgluetabledynamoexport_table where item.id.s = 'order-245-0343447-999530';
SELECT item.id.s, item.address.m.name.s, item.items.l[1].m.sku.s FROM cdkgluetabledynamoexport_table limit 10;
SELECT item.id.s, item.address.m.name.s, product.m.sku.s FROM cdkgluetabledynamoexport_table CROSS JOIN UNNEST(item.items.L) AS unnested (product) limit 10;
```