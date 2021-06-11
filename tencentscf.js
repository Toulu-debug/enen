// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");
const fs = require("fs");
const yaml = require("js-yaml");

process.env.action = 0;
const ScfClient = tencentcloud.scf.v20180416.Client;
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY
  },
  region: process.env.TENCENT_REGION, // 区域参考，https://cloud.tencent.com/document/product/583/17299
  profile: {
    httpProfile: {
      endpoint: "scf.tencentcloudapi.com"
    }
  }
};
const sleep = ms => new Promise(res => setTimeout(res, ms));

!(async () => {
  const client = new ScfClient(clientConfig);
  let params;
  await client.ListFunctions({}).then(
    async data => {
      let func = data.Functions.filter(
        vo => vo.FunctionName === process.env.TENCENT_FUNCTION_NAME
      );
      const file_buffer = fs.readFileSync("./myfile.zip");
      const contents_in_base64 = file_buffer.toString("base64");
      if (func.length) {
        console.log(`更新函数`);
        // 更新代码，删除后重建
        params = {
          FunctionName: process.env.TENCENT_FUNCTION_NAME
        };
        await client.DeleteFunction(params).then(
          data => {
            console.log(data);
          },
          err => {
            console.error("error", err);
            process.env.action++;
          }
        );
        await sleep(1000 * 50); // 等待50秒
      }

      console.log(`创建函数`);
      let inputYML = ".github/workflows/deploy_tencent_scf.yml";
      let obj = yaml.load(fs.readFileSync(inputYML, { encoding: "utf-8" }));
      params = {
        Code: {
          ZipFile: contents_in_base64
        },
        FunctionName: process.env.TENCENT_FUNCTION_NAME,
        Runtime: "Nodejs12.16",
        Timeout: 900,
        Environment: {
          Variables: []
        }
      };
      let vars = [];
      for (let key in obj.jobs.build.env) {
        if (process.env[key].length > 0) {
          vars.push(key);
          params.Environment.Variables.push({
            Key: key,
            Value: process.env[key]
          });
        }
      }
      console.log(`您一共填写了${vars.length}个环境变量`, vars);
      await client.CreateFunction(params).then(
        data => {
          console.log(data);
        },
        err => {
          console.error("error", err);
          process.env.action++;
        }
      );
      await sleep(1000 * 50); // 等待50秒
    },
    err => {
      console.error("error", err);
      process.env.action++;
    }
  );

  /* console.log(`更新环境变量`);
  // 更新环境变量
  let inputYML = ".github/workflows/deploy_tencent_scf.yml";
  let obj = yaml.load(fs.readFileSync(inputYML, { encoding: "utf-8" }));
  let vars = [];
  for (let key in obj.jobs.build.steps[3].env) {
    if (key !== "PATH" && process.env.hasOwnProperty(key))
      vars.push({
        Key: key,
        Value: process.env[key]
      });
  }
  console.log(`您一共填写了${vars.length}个环境变量`);
  params = {
    FunctionName: process.env.TENCENT_FUNCTION_NAME,
    Environment: {
      Variables: vars
    }
  };
  await client.UpdateFunctionConfiguration(params).then(
    data => {
      console.log(data);
    },
    err => {
      console.error("error", err);
    }
  );
  let triggers = [];
  params = {
    FunctionName: process.env.TENCENT_FUNCTION_NAME
  };
  await client.ListTriggers(params).then(
    data => {
      console.log(data);
      triggers = data.Triggers;
    },
    err => {
      console.error("error", err);
    }
  );
  for (let vo of triggers) {
    params = {
      FunctionName: process.env.TENCENT_FUNCTION_NAME,
      Type: "timer",
      TriggerName: vo.TriggerName
    };
    await client.DeleteTrigger(params).then(
      data => {
        console.log(data);
      },
      err => {
        console.error("error", err);
      }
    );
  } */

  // 更新触发器
  console.log(`去更新触发器`);
  let inputYML = "serverless.yml";
  let obj = yaml.load(fs.readFileSync(inputYML, { encoding: "utf-8" }));
  for (let vo of obj.inputs.events) {
    let param = {
      FunctionName: process.env.TENCENT_FUNCTION_NAME,
      TriggerName: vo.timer.parameters.name,
      Type: "timer",
      TriggerDesc: vo.timer.parameters.cronExpression,
      CustomArgument: vo.timer.parameters.argument,
      Enable: "OPEN"
    };
    await client.CreateTrigger(param).then(
      data => {
        console.log(data);
      },
      err => {
        console.error("error", err);
        process.env.action++;
      }
    );
  }
})()
  .catch(e => console.log(e))
  .finally(async () => {
    // 当环境为GitHub action时创建action.js文件判断部署是否进行失败通知
    if (process.env.GITHUB_ACTIONS == "true") {
      fs.writeFile(
        "action.js",
        `var action = ` + process.env.action + `;action > 0 ? require("./sendNotify").sendNotify("云函数部署异常！请重试","点击通知，登入后查看详情",{ url: process.env.GITHUB_SERVER_URL + "/" + process.env.GITHUB_REPOSITORY + "/actions/runs/" + process.env.GITHUB_RUN_ID + "?check_suite_focus=true" }): ""`,
        "utf8",
        function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log("写入action.js成功");
        }
      );
    }
  });
