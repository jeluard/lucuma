(defproject lucuma "0.1.0-SNAPSHOT"
  :description "A Web Components library for ClojureScript"
  :url "http://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1909"]
                 [core.async "0.1.0-SNAPSHOT"]
                 [com.cemerick/clojurescript.test "0.0.4" :scope "test"]]
  :plugins [[lein-cljsbuild "0.3.3"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src" "test"]
                        :compiler {:output-to "target/cljs/lucuma+tests.js"
                                   :output-dir "target/cljs/"
                                   :source-map "target/cljs/lucuma+tests.js.map"
                                   :optimizations :simple
                                   :pretty-print true}}]
              :test-commands {"unit-tests" ["phantomjs" "runners/phantomjs.js" "target/cljs/lucuma+tests.js"]}}
  :min-lein-version "2.3.0")
