# cross-chain-yield-aggregator
* summary
    * プロトコルの概要
        * Cross chain yield aggregatorである
            * 単一のチェーンだけでなく、他のチェーンのレンディングプロトコルもaggregationの対象になっているので、より効率的に利益を確保できる
    * 問題意識
        * 単一のチェーン内のaggregatorだと活用できるプロトコルの数が限定されてしまい、必ずしも最適な利回りではない
        * 各チェーンにそれぞれ資産を預ける必要が発生するのでUXが損なわれている
    * 解決策
        * Vaultは単一のチェーンのままで、レンディング先が複数のチェーンにまで対応したCross chain yield aggregator
            * 他のチェーンのレンディングプロトコルをaggregationするのでより利回りの高いyield aggregatorを実現することができる
            * ユーザも特定のチェーンのプロトコルにdepositするだけなのでUXが高い
* overview
    * アーキテクチャ
        * 画像を挿入
    * 各コントラクトの概要
        * Vault contract
            * 資産のdeposit / redeem
            * APYの計算
            * 資産とデータの移動
                * Axelarの使用
            * 特定の1つのチェーンにのみ存在する
        * Strategy contract
            * 各レンディングプロトコルへのdeposit / redeemの指示
            * 他のチェーンのStrategy contractへのbridge / messaging
        * Wrapper contract
            * 各レンディングプロトコルでのdeposit / redeemを行うコントラクト
            * 対応プロトコル
                * AAVE_V3(Polygon)
                * Compound(Ethereum)
                * Moonwell(Moonbeam)
    * 処理の流れ
        * 以前書いたユーザーフローを参考に
* requirements
    * 環境構築方法
        * インストール方法
        * テストのコマンド
        * デプロイのコマンド
* deployed contract
    * テーブル形式で
* feature to be implemented
* FAQ
    * どのように他のチェーンのデータを取得しているのか
    * どのようなメッセージングプロトコルを使用しているのか
* Other resource
    * Futaba Nodeに関する資料
