(defproject lucuma "0.1.0-SNAPSHOT"
  :description "A Web Components library for ClojureScript"
  :url "http://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1878"]
                 [com.cemerick/clojurescript.test "0.0.4" :scope "test"]
                 [prismatic/dommy "0.1.1" :scope "test"]]
  :plugins [[lein-cljsbuild "0.3.3"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src" "test" "examples"]
                        :compiler {:output-to "target/cljs/lucuma+tests.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]
              :test-commands {"unit-tests" ["runners/phantomjs.js" "target/cljs/lucuma+tests.js"]}}
  :min-lein-version "2.3.0"
  :repositories  {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"})
