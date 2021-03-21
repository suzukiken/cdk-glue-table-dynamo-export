import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue';
import * as s3 from '@aws-cdk/aws-s3';

export class CdkgluetableDynamoexportStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const PREFIX_NAME = id.toLocaleLowerCase().replace('stack', '');
    const S3_DATA_DIR = "data";
    const GLUE_DATABASE_ARN = "arn:aws:glue:ap-northeast-1:00000000:database/default";
    
    const bucket = new s3.Bucket(this, "bucket", {
      bucketName: PREFIX_NAME + "-bucket"
    });

    const database = glue.Database.fromDatabaseArn(
      this,
      "database",
      GLUE_DATABASE_ARN
    );

    const table = new glue.Table(this, "table", {
      database: database,
      tableName: PREFIX_NAME + '_table', // Athena support only underscore
      columns: [{
        name: "Item",
        type: glue.Schema.struct([{
            name: "Id",
            type: glue.Schema.struct([{
              name: "S",
              type: glue.Schema.STRING
            }])
          },{
            name: "address",
            type: glue.Schema.struct([{
              name: "M",
              type: glue.Schema.struct([{
                name: "city",
                type: glue.Schema.struct([{
                  name: "S",
                  type: glue.Schema.STRING
                }])
              },{
                name: "name",
                type: glue.Schema.struct([{
                  name: "S",
                  type: glue.Schema.STRING
                }])
              }])
            }])
          },
          {
            name: "items",
            type: glue.Schema.struct([{
              name: "L",
              type: glue.Schema.array(glue.Schema.struct([{
                name: "M",
                type: glue.Schema.struct([{
                  name: "sku",
                  type: glue.Schema.struct([{
                    name: "S",
                    type: glue.Schema.STRING
                  }])
                },{
                  name: "price",
                  type: glue.Schema.struct([{
                    name: "S",
                    type: glue.Schema.STRING
                  }])
                }])
              }]))
            }])
          }
        ])
      }],
      dataFormat: glue.DataFormat.JSON,
      bucket: bucket,
      s3Prefix: S3_DATA_DIR,
    });
  }
}


