#!/usr/bin/env python3
"""
================================================================================
  HELLO WORLD ENTERPRISE EDITION(tm)  —  v13.0.0-ULTRA-LTS
================================================================================

  Prints "Hello, World!".

  Pipeline (each stage exists for no good reason):

    1. CRYPTOGRAPHIC VAULT
       The greeting is stored as a 91-bit integer, XOR-encrypted with the
       Mersenne prime M89, whose primality is checked at runtime with the
       Lucas-Lehmer test before anyone is allowed to use it as a key.

    2. CHURCH NUMERAL ORACLE
       Each decoded code point is rebuilt as a Church numeral in pure
       untyped lambda calculus (zero, successor, addition, multiplication)
       and then reduced back to an integer.

    3. HWL COMPILER
       A program written in HWL ("Hello World Language", a language made up
       for this file) is tokenized, parsed into an AST by a recursive-descent
       parser, constant-folded, and compiled into assembly.

    4. ASSEMBLER + VIRTUAL MACHINE
       A two-pass assembler resolves labels and turns the assembly into
       bytecode. A stack VM runs it, and the VM gets characters by calling
       the Church Oracle through syscalls.

    5. EVENT BUS
       Every character the VM emits is published as a domain event.

    6. BRAINFUCK TRANSPILER + INTERPRETER
       A subscriber collects the events, writes a Brainfuck program that
       prints them, and runs that program in a Brainfuck interpreter.

    7. GENETIC ALGORITHM
       A seeded evolutionary search with tournament selection, uniform
       crossover and elitism evolves random noise until it matches the
       Brainfuck output.

    8. BYZANTINE CONSENSUS
       Three independent validators vote on the result by SHA-256 digest.
       They must all agree.

    9. OUTPUT STRATEGY / ABSTRACT FACTORY / ADAPTER
       The result is sent through an OutputStrategy made by an
       AbstractOutputSinkFactory and wrapped in a StdoutAdapter, one
       character at a time.

  Everything is wired together by a hand-written Dependency Injection
  container.

  Usage:
      python hello_world.py            # prints Hello, World!
      python hello_world.py --verbose  # prints Hello, World! with lots of logs
================================================================================
"""

from __future__ import annotations

import abc
import enum
import hashlib
import random
import re
import sys
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Protocol, Tuple


# ==============================================================================
#  SECTION 0: ENTERPRISE LOGGING FRAMEWORK
# ==============================================================================

class LogLevel(enum.IntEnum):
    TRACE = 0
    DEBUG = 1
    INFO = 2
    WARN = 3
    ERROR = 4
    SILENT = 99


class Logger:
    """A logging framework, because the standard library one wasn't ours."""

    _COLORS = {
        LogLevel.TRACE: "\033[90m",
        LogLevel.DEBUG: "\033[36m",
        LogLevel.INFO: "\033[32m",
        LogLevel.WARN: "\033[33m",
        LogLevel.ERROR: "\033[31m",
    }
    _RESET = "\033[0m"

    def __init__(self, name: str, level: LogLevel) -> None:
        self.name = name
        self.level = level
        self._t0 = time.perf_counter()

    def _log(self, level: LogLevel, msg: str) -> None:
        if level < self.level:
            return
        elapsed = (time.perf_counter() - self._t0) * 1000
        color = self._COLORS.get(level, "")
        sys.stderr.write(
            f"{color}[{elapsed:9.3f}ms] [{level.name:<5}] [{self.name}] {msg}{self._RESET}\n"
        )

    def trace(self, msg: str) -> None: self._log(LogLevel.TRACE, msg)
    def debug(self, msg: str) -> None: self._log(LogLevel.DEBUG, msg)
    def info(self, msg: str) -> None: self._log(LogLevel.INFO, msg)
    def warn(self, msg: str) -> None: self._log(LogLevel.WARN, msg)
    def error(self, msg: str) -> None: self._log(LogLevel.ERROR, msg)


class LoggerFactory:
    """Factory for Loggers. Every Logger needs a factory."""

    def __init__(self, level: LogLevel) -> None:
        self.level = level

    def create(self, name: str) -> Logger:
        return Logger(name, self.level)


# ==============================================================================
#  SECTION 1: DEPENDENCY INJECTION CONTAINER
# ==============================================================================

class Lifetime(enum.Enum):
    SINGLETON = "singleton"
    TRANSIENT = "transient"


@dataclass
class Registration:
    factory: Callable[["Container"], Any]
    lifetime: Lifetime
    instance: Any = None


class CircularDependencyError(Exception):
    pass


class Container:
    """A hand-written DI container with cycle detection."""

    def __init__(self) -> None:
        self._registry: Dict[str, Registration] = {}
        self._resolving: List[str] = []

    def register(self, key: str, factory: Callable[["Container"], Any],
                 lifetime: Lifetime = Lifetime.SINGLETON) -> "Container":
        self._registry[key] = Registration(factory, lifetime)
        return self

    def resolve(self, key: str) -> Any:
        if key in self._resolving:
            chain = " -> ".join(self._resolving + [key])
            raise CircularDependencyError(f"Circular dependency: {chain}")
        reg = self._registry.get(key)
        if reg is None:
            raise KeyError(f"No registration for service '{key}'")
        if reg.lifetime is Lifetime.SINGLETON and reg.instance is not None:
            return reg.instance
        self._resolving.append(key)
        try:
            instance = reg.factory(self)
        finally:
            self._resolving.pop()
        if reg.lifetime is Lifetime.SINGLETON:
            reg.instance = instance
        return instance


# ==============================================================================
#  SECTION 2: CRYPTOGRAPHIC VAULT (Mersenne-XOR cipher + Lucas-Lehmer)
# ==============================================================================

class NumberTheory:
    @staticmethod
    def lucas_lehmer(p: int) -> bool:
        """Return True iff 2^p - 1 is prime (for odd prime p)."""
        if p == 2:
            return True
        m = (1 << p) - 1
        s = 4
        for _ in range(p - 2):
            s = (s * s - 2) % m
        return s == 0

    @staticmethod
    def is_prime_trial(n: int) -> bool:
        if n < 2:
            return False
        i = 2
        while i * i <= n:
            if n % i == 0:
                return False
            i += 1
        return True


class KeyIntegrityError(Exception):
    pass


class CryptographicVault:
    """
    Holds the greeting, encrypted. The plaintext is a base-128 number whose
    digits are code points, little-endian, XORed with M89 = 2^89 - 1.
    """

    _CIPHERTEXT = 1203357090019401798055677239
    _MERSENNE_EXPONENT = 89
    _RADIX = 128

    def __init__(self, logger: Logger) -> None:
        self.log = logger

    def _derive_key(self) -> int:
        p = self._MERSENNE_EXPONENT
        self.log.debug(f"Checking that exponent p={p} is prime (trial division)...")
        if not NumberTheory.is_prime_trial(p):
            raise KeyIntegrityError(f"Exponent {p} is not prime")
        self.log.debug(f"Running Lucas-Lehmer on M{p} = 2^{p} - 1 ...")
        if not NumberTheory.lucas_lehmer(p):
            raise KeyIntegrityError(f"M{p} is not a Mersenne prime; key rejected")
        key = (1 << p) - 1
        self.log.info(f"Key derived: M{p} = {key} (confirmed prime)")
        return key

    def unseal(self) -> List[int]:
        key = self._derive_key()
        plaintext = self._CIPHERTEXT ^ key
        self.log.debug(f"Decrypted integer: {plaintext}")
        digits: List[int] = []
        while plaintext:
            plaintext, d = divmod(plaintext, self._RADIX)
            digits.append(d)
        self.log.info(f"Unsealed {len(digits)} code points from vault")
        return digits


# ==============================================================================
#  SECTION 3: CHURCH NUMERAL ORACLE (untyped lambda calculus)
# ==============================================================================

# Pure lambda calculus. No integers allowed past this line (until the end).
ZERO = lambda f: lambda x: x
SUCC = lambda n: lambda f: lambda x: f(n(f)(x))
ADD = lambda m: lambda n: lambda f: lambda x: m(f)(n(f)(x))
MUL = lambda m: lambda n: lambda f: m(n(f))
ONE = SUCC(ZERO)
TWO = SUCC(ONE)

TRUE = lambda a: lambda b: a
FALSE = lambda a: lambda b: b
IS_ZERO = lambda n: n(lambda _: FALSE)(TRUE)


class ChurchOracle:
    """
    Rebuilds every code point as a Church numeral using a binary
    decomposition (n = 2q + r), then reduces it back to a Python int by
    applying it to (+1) and 0.
    """

    def __init__(self, vault: CryptographicVault, logger: Logger) -> None:
        self.log = logger
        raw = vault.unseal()
        self._numerals = [self._encode(c) for c in raw]
        self.log.info(f"Encoded {len(self._numerals)} code points as Church numerals")

    def _encode(self, n: int):
        if n == 0:
            return ZERO
        q, r = divmod(n, 2)
        inner = MUL(TWO)(self._encode(q))
        return SUCC(inner) if r else inner

    @staticmethod
    def _reduce(numeral) -> int:
        return numeral(lambda k: k + 1)(0)

    def length(self) -> int:
        count = ZERO
        for _ in self._numerals:
            count = SUCC(count)
        return self._reduce(count)

    def query(self, index: int) -> int:
        numeral = self._numerals[index]
        if IS_ZERO(numeral)(True)(False):
            self.log.warn(f"Oracle[{index}] is zero")
        value = self._reduce(numeral)
        self.log.trace(f"Oracle[{index}] -> λf.λx.f^{value}(x) -> {value} ({chr(value)!r})")
        return value


# ==============================================================================
#  SECTION 4: HWL ("Hello World Language") COMPILER
# ==============================================================================

HWL_SOURCE = r"""
// Hello World Language v1.0
// Ask the oracle for every character and emit it.

let i = 0;
let n = len();
let unused = (3 + 4) - (2 + 5);   // constant folding eats this

while i < n {
    emit oracle(i);
    i = i + 1;
}
"""


# --- Lexer --------------------------------------------------------------------

class TokType(enum.Enum):
    NUM = "NUM"
    ID = "ID"
    KW = "KW"
    OP = "OP"
    EOF = "EOF"


@dataclass(frozen=True)
class Token:
    type: TokType
    value: str
    line: int


class Lexer:
    KEYWORDS = {"let", "while", "emit"}
    SPEC = [
        ("COMMENT", r"//[^\n]*"),
        ("NUM", r"\d+"),
        ("ID", r"[A-Za-z_][A-Za-z0-9_]*"),
        ("OP", r"[+\-<(){};=]"),
        ("NEWLINE", r"\n"),
        ("SKIP", r"[ \t\r]+"),
        ("BAD", r"."),
    ]

    def __init__(self, logger: Logger) -> None:
        self.log = logger
        self._re = re.compile("|".join(f"(?P<{n}>{p})" for n, p in self.SPEC))

    def tokenize(self, src: str) -> List[Token]:
        tokens: List[Token] = []
        line = 1
        for m in self._re.finditer(src):
            kind, text = m.lastgroup, m.group()
            if kind == "NEWLINE":
                line += 1
            elif kind in ("SKIP", "COMMENT"):
                continue
            elif kind == "BAD":
                raise SyntaxError(f"Unexpected character {text!r} on line {line}")
            elif kind == "ID" and text in self.KEYWORDS:
                tokens.append(Token(TokType.KW, text, line))
            else:
                tokens.append(Token(TokType[kind], text, line))
        tokens.append(Token(TokType.EOF, "", line))
        self.log.info(f"Lexed {len(tokens)} tokens")
        return tokens


# --- AST ----------------------------------------------------------------------

class Node(abc.ABC):
    pass


@dataclass
class Num(Node):
    value: int


@dataclass
class Var(Node):
    name: str


@dataclass
class BinOp(Node):
    op: str
    left: Node
    right: Node


@dataclass
class Call(Node):
    func: str
    args: List[Node]


@dataclass
class Let(Node):
    name: str
    expr: Node


@dataclass
class Assign(Node):
    name: str
    expr: Node


@dataclass
class While(Node):
    cond: Node
    body: List[Node]


@dataclass
class Emit(Node):
    expr: Node


@dataclass
class Program(Node):
    body: List[Node]


# --- Parser -------------------------------------------------------------------

class Parser:
    """
    Recursive-descent parser.

      program := stmt*
      stmt    := 'let' ID '=' expr ';'
               | ID '=' expr ';'
               | 'while' expr '{' stmt* '}'
               | 'emit' expr ';'
      expr    := add ('<' add)?
      add     := primary (('+' | '-') primary)*
      primary := NUM | ID | ID '(' [expr] ')' | '(' expr ')'
    """

    def __init__(self, logger: Logger) -> None:
        self.log = logger
        self.toks: List[Token] = []
        self.pos = 0

    def parse(self, toks: List[Token]) -> Program:
        self.toks, self.pos = toks, 0
        body = []
        while self._peek().type is not TokType.EOF:
            body.append(self._stmt())
        self.log.info(f"Parsed program with {len(body)} top-level statements")
        return Program(body)

    def _peek(self) -> Token:
        return self.toks[self.pos]

    def _next(self) -> Token:
        tok = self.toks[self.pos]
        self.pos += 1
        return tok

    def _expect(self, value: str) -> Token:
        tok = self._next()
        if tok.value != value:
            raise SyntaxError(f"Line {tok.line}: expected {value!r}, got {tok.value!r}")
        return tok

    def _stmt(self) -> Node:
        tok = self._peek()
        if tok.type is TokType.KW and tok.value == "let":
            self._next()
            name = self._next().value
            self._expect("=")
            expr = self._expr()
            self._expect(";")
            return Let(name, expr)
        if tok.type is TokType.KW and tok.value == "while":
            self._next()
            cond = self._expr()
            self._expect("{")
            body = []
            while self._peek().value != "}":
                body.append(self._stmt())
            self._expect("}")
            return While(cond, body)
        if tok.type is TokType.KW and tok.value == "emit":
            self._next()
            expr = self._expr()
            self._expect(";")
            return Emit(expr)
        if tok.type is TokType.ID:
            name = self._next().value
            self._expect("=")
            expr = self._expr()
            self._expect(";")
            return Assign(name, expr)
        raise SyntaxError(f"Line {tok.line}: unexpected token {tok.value!r}")

    def _expr(self) -> Node:
        left = self._add()
        if self._peek().value == "<":
            self._next()
            return BinOp("<", left, self._add())
        return left

    def _add(self) -> Node:
        node = self._primary()
        while self._peek().value in ("+", "-"):
            op = self._next().value
            node = BinOp(op, node, self._primary())
        return node

    def _primary(self) -> Node:
        tok = self._next()
        if tok.type is TokType.NUM:
            return Num(int(tok.value))
        if tok.type is TokType.ID:
            if self._peek().value == "(":
                self._next()
                args = []
                if self._peek().value != ")":
                    args.append(self._expr())
                self._expect(")")
                return Call(tok.value, args)
            return Var(tok.value)
        if tok.value == "(":
            node = self._expr()
            self._expect(")")
            return node
        raise SyntaxError(f"Line {tok.line}: unexpected {tok.value!r} in expression")


# --- Optimizer ----------------------------------------------------------------

class ConstantFolder:
    """Evaluates constant expressions at compile time."""

    def __init__(self, logger: Logger) -> None:
        self.log = logger
        self.folds = 0

    def fold(self, node: Node) -> Node:
        if isinstance(node, Program):
            node.body = [self.fold(s) for s in node.body]
        elif isinstance(node, (Let, Assign)):
            node.expr = self.fold(node.expr)
        elif isinstance(node, Emit):
            node.expr = self.fold(node.expr)
        elif isinstance(node, While):
            node.cond = self.fold(node.cond)
            node.body = [self.fold(s) for s in node.body]
        elif isinstance(node, Call):
            node.args = [self.fold(a) for a in node.args]
        elif isinstance(node, BinOp):
            node.left, node.right = self.fold(node.left), self.fold(node.right)
            if isinstance(node.left, Num) and isinstance(node.right, Num):
                a, b = node.left.value, node.right.value
                result = {"+": a + b, "-": a - b, "<": int(a < b)}[node.op]
                self.folds += 1
                self.log.debug(f"Constant-folded ({a} {node.op} {b}) => {result}")
                return Num(result)
        return node


# --- Code generator -----------------------------------------------------------

class CodeGenerator:
    """Turns the AST into textual stack-machine assembly."""

    def __init__(self, logger: Logger) -> None:
        self.log = logger
        self.lines: List[str] = []
        self._label_counter = 0

    def _label(self, hint: str) -> str:
        self._label_counter += 1
        return f"{hint}_{self._label_counter}"

    def _emit(self, line: str) -> None:
        self.lines.append(line)

    def generate(self, prog: Program) -> str:
        self.lines = ["; generated by HWL compiler", "start:"]
        for stmt in prog.body:
            self._stmt(stmt)
        self._emit("    HALT")
        asm = "\n".join(self.lines)
        self.log.info(f"Generated {len(self.lines)} lines of assembly")
        return asm

    def _stmt(self, node: Node) -> None:
        if isinstance(node, (Let, Assign)):
            self._expr(node.expr)
            self._emit(f"    STORE {node.name}")
        elif isinstance(node, Emit):
            self._expr(node.expr)
            self._emit("    SYS emit")
        elif isinstance(node, While):
            top, end = self._label("loop"), self._label("endloop")
            self._emit(f"{top}:")
            self._expr(node.cond)
            self._emit(f"    JZ {end}")
            for s in node.body:
                self._stmt(s)
            self._emit(f"    JMP {top}")
            self._emit(f"{end}:")
        else:
            raise TypeError(f"Unknown statement {node!r}")

    def _expr(self, node: Node) -> None:
        if isinstance(node, Num):
            self._emit(f"    PUSH {node.value}")
        elif isinstance(node, Var):
            self._emit(f"    LOAD {node.name}")
        elif isinstance(node, BinOp):
            self._expr(node.left)
            self._expr(node.right)
            self._emit("    " + {"+": "ADD", "-": "SUB", "<": "LT"}[node.op])
        elif isinstance(node, Call):
            for a in node.args:
                self._expr(a)
            self._emit(f"    SYS {node.func}")
        else:
            raise TypeError(f"Unknown expression {node!r}")


# ==============================================================================
#  SECTION 5: ASSEMBLER + STACK VIRTUAL MACHINE
# ==============================================================================

class Op(enum.IntEnum):
    HALT = 0x00
    PUSH = 0x01
    LOAD = 0x02
    STORE = 0x03
    ADD = 0x10
    SUB = 0x11
    LT = 0x12
    JMP = 0x20
    JZ = 0x21
    SYS = 0x30


OPERAND_OPS = {Op.PUSH, Op.LOAD, Op.STORE, Op.JMP, Op.JZ, Op.SYS}


@dataclass
class Executable:
    code: List[int]
    symbols: List[str]
    syscalls: List[str]


class Assembler:
    """Two-pass assembler: pass 1 finds labels, pass 2 writes bytecode."""

    def __init__(self, logger: Logger) -> None:
        self.log = logger

    def assemble(self, asm: str) -> Executable:
        instrs: List[Tuple[str, Optional[str]]] = []
        labels: Dict[str, int] = {}
        addr = 0
        for raw in asm.splitlines():
            line = raw.split(";", 1)[0].strip()
            if not line:
                continue
            if line.endswith(":"):
                labels[line[:-1]] = addr
                continue
            parts = line.split()
            mnemonic, arg = parts[0], (parts[1] if len(parts) > 1 else None)
            instrs.append((mnemonic, arg))
            addr += 2 if Op[mnemonic] in OPERAND_OPS else 1
        self.log.debug(f"Pass 1: {len(labels)} labels resolved: {labels}")

        symbols: List[str] = []
        syscalls: List[str] = []
        code: List[int] = []
        for mnemonic, arg in instrs:
            op = Op[mnemonic]
            code.append(int(op))
            if op is Op.PUSH:
                code.append(int(arg))
            elif op in (Op.LOAD, Op.STORE):
                if arg not in symbols:
                    symbols.append(arg)
                code.append(symbols.index(arg))
            elif op in (Op.JMP, Op.JZ):
                code.append(labels[arg])
            elif op is Op.SYS:
                if arg not in syscalls:
                    syscalls.append(arg)
                code.append(syscalls.index(arg))
        self.log.info(f"Pass 2: assembled {len(code)} bytes of bytecode")
        self.log.debug("Bytecode: " + " ".join(f"{b:02X}" for b in code))
        return Executable(code, symbols, syscalls)


class VMError(Exception):
    pass


class VirtualMachine:
    """A stack-based VM with a syscall table."""

    MAX_CYCLES = 1_000_000

    def __init__(self, syscall_table: Dict[str, Callable[[List[int]], None]],
                 logger: Logger) -> None:
        self.sys_table = syscall_table
        self.log = logger

    def run(self, exe: Executable) -> int:
        stack: List[int] = []
        mem = [0] * len(exe.symbols)
        handlers = [self.sys_table[name] for name in exe.syscalls]
        pc = cycles = 0
        code = exe.code
        while True:
            cycles += 1
            if cycles > self.MAX_CYCLES:
                raise VMError("Cycle limit exceeded (did you solve the halting problem?)")
            op = Op(code[pc])
            arg = code[pc + 1] if op in OPERAND_OPS else None
            pc += 2 if arg is not None else 1
            if op is Op.HALT:
                break
            elif op is Op.PUSH:
                stack.append(arg)
            elif op is Op.LOAD:
                stack.append(mem[arg])
            elif op is Op.STORE:
                mem[arg] = stack.pop()
            elif op is Op.ADD:
                b, a = stack.pop(), stack.pop()
                stack.append(a + b)
            elif op is Op.SUB:
                b, a = stack.pop(), stack.pop()
                stack.append(a - b)
            elif op is Op.LT:
                b, a = stack.pop(), stack.pop()
                stack.append(int(a < b))
            elif op is Op.JMP:
                pc = arg
            elif op is Op.JZ:
                if stack.pop() == 0:
                    pc = arg
            elif op is Op.SYS:
                handlers[arg](stack)
        self.log.info(f"VM halted after {cycles} cycles; final stack depth {len(stack)}")
        return cycles


# ==============================================================================
#  SECTION 6: EVENT BUS
# ==============================================================================

@dataclass(frozen=True)
class DomainEvent:
    topic: str
    payload: Any
    sequence: int


class EventBus:
    def __init__(self, logger: Logger) -> None:
        self.log = logger
        self._subs: Dict[str, List[Callable[[DomainEvent], None]]] = {}
        self._seq = 0

    def subscribe(self, topic: str, handler: Callable[[DomainEvent], None]) -> None:
        self._subs.setdefault(topic, []).append(handler)
        self.log.debug(f"Subscriber {getattr(handler, '__qualname__', handler)} -> '{topic}'")

    def publish(self, topic: str, payload: Any) -> None:
        self._seq += 1
        event = DomainEvent(topic, payload, self._seq)
        self.log.trace(f"PUBLISH #{event.sequence} {topic}: {payload!r}")
        for handler in self._subs.get(topic, []):
            handler(event)


# ==============================================================================
#  SECTION 7: BRAINFUCK TRANSPILER + INTERPRETER
# ==============================================================================

class BrainfuckTranspiler:
    """Listens for 'char.emitted' events and builds a Brainfuck program."""

    def __init__(self, bus: EventBus, logger: Logger) -> None:
        self.log = logger
        self.codepoints: List[int] = []
        bus.subscribe("char.emitted", self.on_char)

    def on_char(self, event: DomainEvent) -> None:
        self.codepoints.append(event.payload)

    @staticmethod
    def _gen_char(target: int) -> str:
        # cell0 = target, using cell1 as a loop counter: a*b + r
        a = max(1, int(target ** 0.5))
        b, r = divmod(target, a)
        return "[-]>" + "+" * a + "[<" + "+" * b + ">-]<" + "+" * r + "."

    def transpile(self) -> str:
        program = "".join(self._gen_char(c) for c in self.codepoints)
        self.log.info(f"Transpiled {len(self.codepoints)} chars into {len(program)} BF instructions")
        self.log.trace(f"BF: {program}")
        return program


class BrainfuckInterpreter:
    def __init__(self, logger: Logger) -> None:
        self.log = logger

    def run(self, program: str) -> str:
        jump: Dict[int, int] = {}
        stack: List[int] = []
        for i, ch in enumerate(program):
            if ch == "[":
                stack.append(i)
            elif ch == "]":
                j = stack.pop()
                jump[i], jump[j] = j, i
        if stack:
            raise SyntaxError("Unbalanced brackets in Brainfuck program")
        tape = [0] * 30000
        ptr = pc = steps = 0
        out: List[str] = []
        while pc < len(program):
            c = program[pc]
            if c == ">":
                ptr += 1
            elif c == "<":
                ptr -= 1
            elif c == "+":
                tape[ptr] = (tape[ptr] + 1) & 0xFF
            elif c == "-":
                tape[ptr] = (tape[ptr] - 1) & 0xFF
            elif c == ".":
                out.append(chr(tape[ptr]))
            elif c == "[" and tape[ptr] == 0:
                pc = jump[pc]
            elif c == "]" and tape[ptr] != 0:
                pc = jump[pc]
            pc += 1
            steps += 1
        self.log.info(f"Brainfuck executed {steps} steps")
        return "".join(out)


# ==============================================================================
#  SECTION 8: GENETIC ALGORITHM
# ==============================================================================

@dataclass(order=True)
class Individual:
    fitness: int
    genome: str = field(compare=False)


class GeneticEvolver:
    """Evolves random strings until one matches the target."""

    ALPHABET = "".join(chr(c) for c in range(32, 127))

    def __init__(self, logger: Logger, seed: int = 0xC0FFEE,
                 population: int = 300, mutation_rate: float = 0.04,
                 tournament: int = 5, elites: int = 4) -> None:
        self.log = logger
        self.rng = random.Random(seed)
        self.pop_size = population
        self.mutation_rate = mutation_rate
        self.tournament = tournament
        self.elites = elites

    def _fitness(self, genome: str, target: str) -> int:
        return sum(a == b for a, b in zip(genome, target))

    def _random_genome(self, n: int) -> str:
        return "".join(self.rng.choice(self.ALPHABET) for _ in range(n))

    def _select(self, pop: List[Individual]) -> Individual:
        return max(self.rng.sample(pop, self.tournament))

    def _crossover(self, a: str, b: str) -> str:
        return "".join(x if self.rng.random() < 0.5 else y for x, y in zip(a, b))

    def _mutate(self, g: str) -> str:
        return "".join(self.rng.choice(self.ALPHABET) if self.rng.random() < self.mutation_rate
                       else ch for ch in g)

    def evolve(self, target: str, max_generations: int = 10_000) -> str:
        n = len(target)
        pop = [Individual(self._fitness(g, target), g)
               for g in (self._random_genome(n) for _ in range(self.pop_size))]
        for gen in range(max_generations):
            pop.sort(reverse=True)
            best = pop[0]
            if gen % 10 == 0 or best.fitness == n:
                self.log.debug(f"Gen {gen:4d}  best={best.genome!r}  fitness={best.fitness}/{n}")
            if best.fitness == n:
                self.log.info(f"Evolution converged in {gen} generations")
                return best.genome
            nxt = pop[:self.elites]
            while len(nxt) < self.pop_size:
                child = self._mutate(self._crossover(self._select(pop).genome,
                                                     self._select(pop).genome))
                nxt.append(Individual(self._fitness(child, target), child))
            pop = nxt
        raise RuntimeError("Evolution failed; natural selection has let us down")


# ==============================================================================
#  SECTION 9: BYZANTINE CONSENSUS
# ==============================================================================

class Validator(Protocol):
    name: str
    def attest(self) -> str: ...


@dataclass
class HashValidator:
    name: str
    source: Callable[[], str]

    def attest(self) -> str:
        return hashlib.sha256(self.source().encode("utf-8")).hexdigest()


class ConsensusFailure(Exception):
    pass


class ByzantineConsensusEngine:
    """Requires every validator to agree. Allows zero traitors."""

    def __init__(self, logger: Logger) -> None:
        self.log = logger

    def reach_consensus(self, validators: List[Validator]) -> str:
        votes = {}
        for v in validators:
            digest = v.attest()
            votes[v.name] = digest
            self.log.debug(f"Validator {v.name:<16} votes {digest[:16]}...")
        if len(set(votes.values())) != 1:
            raise ConsensusFailure(f"Validators disagree: {votes}")
        digest = next(iter(votes.values()))
        self.log.info(f"Unanimous consensus reached ({len(votes)}/{len(votes)}): {digest[:16]}...")
        return digest


# ==============================================================================
#  SECTION 10: OUTPUT STRATEGY / ABSTRACT FACTORY / ADAPTER
# ==============================================================================

class OutputSink(abc.ABC):
    @abc.abstractmethod
    def write_char(self, ch: str) -> None: ...

    @abc.abstractmethod
    def flush(self) -> None: ...


class StdoutAdapter(OutputSink):
    """Adapts sys.stdout to the OutputSink interface."""

    def __init__(self, stream=None) -> None:
        self._stream = stream or sys.stdout

    def write_char(self, ch: str) -> None:
        self._stream.write(ch)

    def flush(self) -> None:
        self._stream.flush()


class AbstractOutputSinkFactory(abc.ABC):
    @abc.abstractmethod
    def create_sink(self) -> OutputSink: ...


class ConsoleOutputSinkFactory(AbstractOutputSinkFactory):
    def create_sink(self) -> OutputSink:
        return StdoutAdapter()


class OutputStrategy(abc.ABC):
    @abc.abstractmethod
    def render(self, message: str, sink: OutputSink) -> None: ...


class CharacterByCharacterOutputStrategy(OutputStrategy):
    def render(self, message: str, sink: OutputSink) -> None:
        for ch in message:
            sink.write_char(ch)
        sink.write_char("\n")
        sink.flush()


# ==============================================================================
#  SECTION 11: ORCHESTRATION
# ==============================================================================

class HelloWorldOrchestrator:
    def __init__(self, c: Container) -> None:
        self.c = c
        self.log: Logger = c.resolve("logger_factory").create("Orchestrator")

    def execute(self) -> None:
        lf: LoggerFactory = self.c.resolve("logger_factory")
        bus: EventBus = self.c.resolve("event_bus")
        oracle: ChurchOracle = self.c.resolve("oracle")
        transpiler: BrainfuckTranspiler = self.c.resolve("bf_transpiler")

        self.log.info("=== Stage: Compilation ===")
        tokens = self.c.resolve("lexer").tokenize(HWL_SOURCE)
        ast = self.c.resolve("parser").parse(tokens)
        ast = self.c.resolve("optimizer").fold(ast)
        asm = self.c.resolve("codegen").generate(ast)
        for line in asm.splitlines():
            self.log.trace(f"ASM | {line}")
        exe = self.c.resolve("assembler").assemble(asm)

        self.log.info("=== Stage: Execution ===")
        vm_raw: List[int] = []

        def sys_emit(stack: List[int]) -> None:
            cp = stack.pop()
            vm_raw.append(cp)
            bus.publish("char.emitted", cp)

        def sys_oracle(stack: List[int]) -> None:
            stack.append(oracle.query(stack.pop()))

        def sys_len(stack: List[int]) -> None:
            stack.append(oracle.length())

        vm = VirtualMachine({"emit": sys_emit, "oracle": sys_oracle, "len": sys_len},
                            lf.create("VM"))
        vm.run(exe)

        self.log.info("=== Stage: Brainfuck ===")
        bf_program = transpiler.transpile()
        bf_output = self.c.resolve("bf_interpreter").run(bf_program)

        self.log.info("=== Stage: Evolution ===")
        evolved = self.c.resolve("evolver").evolve(bf_output)

        self.log.info("=== Stage: Consensus ===")
        self.c.resolve("consensus").reach_consensus([
            HashValidator("VM-Raw", lambda: "".join(map(chr, vm_raw))),
            HashValidator("Brainfuck", lambda: bf_output),
            HashValidator("Darwin", lambda: evolved),
        ])

        self.log.info("=== Stage: Output ===")
        sink = self.c.resolve("sink_factory").create_sink()
        self.c.resolve("output_strategy").render(evolved, sink)
        self.log.info("Greeting delivered. Have a nice day.")


def build_container(level: LogLevel) -> Container:
    c = Container()
    c.register("logger_factory", lambda c: LoggerFactory(level))
    L = lambda name: (lambda c: c.resolve("logger_factory").create(name))
    c.register("vault", lambda c: CryptographicVault(L("Vault")(c)))
    c.register("oracle", lambda c: ChurchOracle(c.resolve("vault"), L("ChurchOracle")(c)))
    c.register("event_bus", lambda c: EventBus(L("EventBus")(c)))
    c.register("lexer", lambda c: Lexer(L("Lexer")(c)))
    c.register("parser", lambda c: Parser(L("Parser")(c)))
    c.register("optimizer", lambda c: ConstantFolder(L("Optimizer")(c)))
    c.register("codegen", lambda c: CodeGenerator(L("CodeGen")(c)))
    c.register("assembler", lambda c: Assembler(L("Assembler")(c)))
    c.register("bf_transpiler", lambda c: BrainfuckTranspiler(c.resolve("event_bus"),
                                                              L("BFTranspiler")(c)))
    c.register("bf_interpreter", lambda c: BrainfuckInterpreter(L("BFInterp")(c)))
    c.register("evolver", lambda c: GeneticEvolver(L("Darwin")(c)))
    c.register("consensus", lambda c: ByzantineConsensusEngine(L("Consensus")(c)))
    c.register("sink_factory", lambda c: ConsoleOutputSinkFactory())
    c.register("output_strategy", lambda c: CharacterByCharacterOutputStrategy())
    c.register("orchestrator", lambda c: HelloWorldOrchestrator(c), Lifetime.TRANSIENT)
    return c


def main(argv: List[str]) -> int:
    level = LogLevel.SILENT
    if "--verbose" in argv:
        level = LogLevel.DEBUG
    if "--trace" in argv:
        level = LogLevel.TRACE
    sys.setrecursionlimit(10_000)  # Church numerals go deep
    build_container(level).resolve("orchestrator").execute()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
