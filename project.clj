(defproject lucuma "0.1.0-SNAPSHOT"
  :description "A Web Components library for ClojureScript"
  :url "http://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1934"]
                 [com.cemerick/clojurescript.test "0.0.4" :scope "test"]]
  :plugins [[lein-cljsbuild "0.3.3"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src" "test"]
                        :compiler {:output-to "target/cljs/lucuma.js"
                                   :optimizations :simple
                                   :pretty-print true}}]
              :test-commands {;; Disabled for now: based on too old webkit version. "phantomjs" ["phantomjs" "resources/test/runner.js" "resources/test/assets/platform.js" "target/cljs/lucuma.js"]
                              "slimerjs" ["slimerjs" "resources/test/runner.js" "resources/test/assets/platform.js" "target/cljs/lucuma.js"]}}
  :min-lein-version "2.3.0")
