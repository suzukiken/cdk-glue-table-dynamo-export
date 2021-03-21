#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkgluetableDynamoexportStack } from '../lib/cdkgluetable-dynamoexport-stack';

const app = new cdk.App();
new CdkgluetableDynamoexportStack(app, 'CdkgluetableDynamoexportStack');
