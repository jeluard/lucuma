(defproject lucuma-examples "0.5.0-SNAPSHOT"
  :profiles
  {:dev
   {:dependencies [[org.clojure/clojure "1.6.0"]
                   [org.clojure/clojurescript "0.0-2371"]
                   [lucuma "0.5.0-SNAPSHOT"]
                   [prismatic/dommy "0.1.3"]
                   [hipo "0.1.0"]]
    :plugins [[lein-cljsbuild "1.0.3"]
              [com.cemerick/clojurescript.test "0.3.1"]]}}
  :cljsbuild
  {:builds
   {:test
    {:source-paths ["src"]
     :compiler {:output-to "target/cljs/unit-test.js"
                :optimizations :whitespace}}}}
  :aliases {"clean-compile" ["do" "clean," "cljsbuild" "once"]}
  :min-lein-version "2.5.0")


