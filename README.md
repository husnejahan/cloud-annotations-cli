```
$ cacli
┌─────────────────────────────┐
│ (C)loud (A)nnotations (CLI) │
│ version 0.0.1               │
└─────────────────────────────┘

Usage: cacli <command>

where <command> is one of:
  init         Interactively create a config.yaml file
  train        Start a training run
  logs         Monitor the logs of a training run
  progress     Monitor the progress of a training run
  list         List all training runs
  download     Download a trained model

cacli <cmd> -h     quick help on <cmd>
```

```
$ cacli <cmd> -h
cacli init [--force|-f|--yes|-y]
cacli train [--gpu <k80|k80x2|k80x4|v100|v100x2>] [--steps <steps>]
cacli monitor [<model_id>]
cacli list
cacli download [<model_id>] [--saved-model] [--tflite] [--tfjs] [--coreml]
```

```
$ cacli init
This utility will walk you through creating a config.yaml file.
It only covers the most common items, and tries to guess sensible defaults.

Watson Machine Learning Credentials
instance_id: ***
username: ***
password: ***
url: (https://us-south.ml.cloud.ibm.com)

Cloud Object Storage Credentials
access_key_id: ***
secret_access_key: ***
region: (us-geo)

Choose a training data bucket:
  1) pepsi-coke-mountaindew
  2) counting-cars
  3) output
Bucket: 1

Would you like to store output in a separate bucket? (yes) n

Training Params
gpu: (k80) v100x2
steps: (500) 5000

project name: (pepsi-coke-mountaindew)

About to write to /Users/niko/config.yaml:

name: pepsi-coke-mountaindew
credentials:
  wml:
    instance_id: ***
    username: ***
    password: ***
    url: https://us-south.ml.cloud.ibm.com
  cos:
    access_key_id: ***
    secret_access_key: ***
    region: us-geo
buckets:
  training: pepsi-coke-mountaindew
trainingParams:
  gpu: v100x2
  steps: 5000

Is this ok? (yes)
```

```
$ cacli train
(Using settings from config.yaml)
Starting training run...

Model ID:
┌──────────────────┐
│  model-lfm9zc32  │
└──────────────────┘

Would you like to monitor this training run? (yes)
```

```
$ cacli train
No config.yaml found, so we will ask you a bunch of questions instead.
Your answers can optionally be saved in a config.yaml file for later use.

(ask cacli init questions)

(optional) Would you like to save your responces in a config.yaml? (yes) n

Starting training run...

Model ID:
┌──────────────────┐
│  model-lfm9zc32  │
└──────────────────┘

Would you like to monitor this training run? (yes)
```