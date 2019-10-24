# mrs
Compiler for the mrs language -- MARIE Really Sux 

## What is mrs?
This project compiles the mrs language to MARIE assembly [see MARIE-js wiki for more info](https://github.com/MARIE-js/MARIE.js/wiki). 

You can also find an online (in-browser) MARIE compiler, virtual machine, and various debugging tools at [https://marie.js.org/](https://marie.js.org/)

## Example program
```
func add a b {
    i16 something = 52
    return a * b + something
}

func main {
    i32 x = 5
    str text1 = 'hello world'
    str text2 = 'fizz buzz'

    i8 value = input()

    if (value > x) {
        output(text1)
    } else {
        output(text2)
    }
}
```

## License
Copyright (C) 2019 SysDevs

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
