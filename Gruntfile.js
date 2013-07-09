module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    regarde: {
      js: {
        files: [
            'app.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      ts: {
        files: [
            'src/**/*.ts'
        ],
        tasks: ['typescript', 'delayed-livereload']
      },
      pub: {
        files: [
            'public/**/*.html',
            'public/**/*.css'
        ],
        tasks: ['livereload']
      }
    },
    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: '',
        options: {
          module: 'amd',
          target: 'es5',
          base_path: 'src',
          sourcemap: true,
          fullSourceMapPath: true
        }
      }
    },
    exec: {
      tsd: {
        cmd: function() {
          var dependencies = [
              'easeljs',
              'tweenjs'
          ];
          return 'tsd install ' + dependencies.join(' ');
        }
      }
    }
  });
  grunt.registerTask('delayed-livereload', 'delayed livereload', function() {
    var done = this.async();
    setTimeout(function() {
      grunt.task.run('livereload');
      done();
    }, 500);
  });
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', [
      'typescript',
      'livereload-start',
      'develop',
      'regarde'
  ]);
};