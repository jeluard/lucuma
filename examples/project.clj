(defproject lucuma-examples "0.5.0-SNAPSHOT"
  :profiles
  {:dev
   {:dependencies [[org.clojure/clojure "1.7.0"]
                   [org.clojure/clojurescript "0.0-3308"]
                   [lucuma "0.5.0-SNAPSHOT"]
                   [prismatic/dommy "1.0.0"]
                   [hipo "0.3.0"]
                   [cljsjs/document-register-element "0.4.3-0"]]
    :plugins [[lein-cljsbuild "1.0.5"]
              [com.cemerick/clojurescript.test "0.3.3"]]}}
  :cljsbuild
  {:builds
   {:test
    {:source-paths ["src"]
     :compiler {:output-to "target/cljs/examples.js"
                :optimizations :whitespace}}}}
  :aliases {"clean-compile" ["do" "clean," "cljsbuild" "once"]}
  :min-lein-version "2.5.0")


