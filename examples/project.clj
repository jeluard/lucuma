(defproject lucuma-examples "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1859"]
                 [lucuma "0.1.0-SNAPSHOT"]]
  :min-lein-version "2.3.0"
  :plugins [[lein-cljsbuild "0.3.2"]]
  :cljsbuild {:builds {:dev {:source-paths ["src"]
                             :compiler {:output-to "examples.js"
                                        :optimizations :whitespace
                                        :pretty-print true}}}}
  :hooks [leiningen.cljsbuild])
