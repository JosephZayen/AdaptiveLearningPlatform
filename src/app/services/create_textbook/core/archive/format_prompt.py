
def build_parser():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest='command', help="subparsers", required=True)
    parser_coding = subparsers.add_parser(name="coding")
    parser_textbook = subparsers.add_parser(name="textbook")

    parser_textbook.add_argument("-i", "--identity", required=True)
    parser_textbook.add_argument("-t", "--textbook", required=True)

    parser_coding.add_argument("-cl", "--coding_language", required=True)
    parser_coding.add_argument("-t", "--textbook", required=True)
    parser_coding.add_argument("-l", "--language", required=False, default="中文", choices=["英文", "中文"])
    parser_coding.add_argument("-o", "--last_output", required=False, default=None)

    return parser

def format_sysprompt(args):
    config = Config()
    if args.command == "textbook":
        config.init_from_textbook(args)
        identity = config.get_arg("identity")
        textbook = config.get_arg("textbook")
        sysprompt = TEXTBOOK_PROMPT.format(identity=identity, textbook=textbook, output_format=OUTPUT_FORMAT)
    elif args.command == "coding":
        config.init_from_coding(args)
        cl = config.get_arg("coding_language")
        textbook = config.get_arg("textbook")
        language = config.get_arg("language")
        sysprompt = CODING_PROMPT.format(coding_language=cl or "",textbook=textbook or "",language=language or "",output_format=OUTPUT_FORMAT or "")
    return sysprompt