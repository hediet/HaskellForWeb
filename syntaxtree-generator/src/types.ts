import { TemplateField, TemplateType, ArrayType,
	StringType, UnionType, FieldOptions, ImplicitTemplateField } from "./Helper/Annotations";

function MyTemplateType() {
    return TemplateType("hediet.de/haskell-parser");
}  

@MyTemplateType()
export abstract class AbstractTokenKind {
	public abstract getName(): string;
}

@MyTemplateType()
export class TokenKind extends AbstractTokenKind {
	@ImplicitTemplateField()
	public name: string;

	public getName() { return this.name; }
}

@MyTemplateType()
export class ReservedId extends AbstractTokenKind {
	@ImplicitTemplateField()
	public identifier: string;

	@TemplateField()
	public name: string;

	public getName() {
		if (this.name) return this.name;
		const str = this.identifier.substr(0, 1).toUpperCase() + this.identifier.substr(1);
		return str + "Keyword";
	}
}

@MyTemplateType()
export class ReservedOp extends AbstractTokenKind {
	@ImplicitTemplateField()
	public op: string;

	@TemplateField()
	public name: string;

	public getName() { return this.name; }
}


@MyTemplateType()
export class SpecialToken extends AbstractTokenKind {
	@ImplicitTemplateField()
	public character: string;

	@TemplateField()
	public name: string;

	public getName() { return this.name; }
}



@MyTemplateType()
export class AbstractMember {}

@MyTemplateType()
export class Member extends AbstractMember {
	@ImplicitTemplateField()
	public name: string;

	@TemplateField()
	public type: string;

	@TemplateField()
	public isOptional: boolean;
}

@MyTemplateType()
export class Members extends AbstractMember {
	@ImplicitTemplateField()
	public name: string;

	@TemplateField()
	public type: string;

	@TemplateField()
	public atLeast: number;

	@TemplateField()
	public separatedByToken: string;
}

@MyTemplateType()
export class Token extends AbstractMember {
	@ImplicitTemplateField()
	public name: string;

	@TemplateField()
	public kind: string;

	@TemplateField()
	public isOptional: boolean;
}

@MyTemplateType()
export abstract class SyntaxOrAbstractSyntax {

}

@MyTemplateType()
export class AbstractSyntax extends SyntaxOrAbstractSyntax {
	@ImplicitTemplateField()
	public name: string;

	@ImplicitTemplateField({ itemCtor: AbstractMember })
	public derivedSyntaxes: SyntaxOrAbstractSyntax[];
}

@MyTemplateType()
export class Syntax extends SyntaxOrAbstractSyntax {
	@ImplicitTemplateField()
	public name: string;

	@ImplicitTemplateField({ itemCtor: AbstractMember })
	public members: AbstractMember[];

	@TemplateField({ itemCtor: SyntaxOrAbstractSyntax })
	public helpers: SyntaxOrAbstractSyntax[];
}

@MyTemplateType()
export class SyntaxDescription {
	@TemplateField({ itemCtor: TokenKind })
	public tokenKinds: TokenKind[];

	@TemplateField({ itemCtor: SyntaxOrAbstractSyntax })
	public syntaxes: SyntaxOrAbstractSyntax[];
}

