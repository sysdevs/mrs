# mrs
Compiler for the mrs language -- MARIE Really Sux 

## What is mrs?
This project compiles the mrs language to MARIE assembly [see MARIE-js wiki for more info](https://github.com/MARIE-js/MARIE.js/wiki). 

You can also find an online (in-browser) MARIE compiler, virtual machine, and various debugging tools at [https://marie.js.org/](https://marie.js.org/) 

## Installation and usage
Ensure that you have NodeJS and npm installed on your system.
```bash
git clone https://github.com/sysdevs/mrs && cd mrs
npm install
node index.js --help # shows help
node index.js --input programs/main.mrs --output main.mas
```

## Example program
An example program is in the directory `programs/main.mrs`, and its compiled assembly is located at `program.mas`. 
 
Below is a contrived program. 
```go
func add a b {
    return a + b
}

func main {
    int x = add(5 10)
    int value = input()

    str text = 'hello world'

    if (value > x) {
        print(text)
    } else {
        if (value = 0) {
            print('goodbye world')
        } else {
            print('goodnight world')
        }
    }
}
```

## License
Copyright (C) 2019 SysDevs

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
